import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { env } from "../../../env/server.mjs";
import metascraper from "metadata-scraper";
import puppeteer from "puppeteer";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export const giftRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.gift.findMany({
      where: { userId: ctx.session.user.id, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
  }),
  getAllByUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.gift.findMany({
        where: { userId: input.userId, deletedAt: null },
        orderBy: { createdAt: "asc" },
      });
    }),

  getMetadata: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0"
      );
      await page.goto(input.url, { waitUntil: "domcontentloaded" });
      const pageContent = await page.content();
      return metascraper({ url: input.url, html: pageContent });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string().optional(),
        imageUrl: z.string().optional(),
        link: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let imageUrl = input.imageUrl;
      if (input.image) {
        const contentType = input.image.match(/data:(.*);base64/)?.[1];
        const base64FileData = input.image.split("base64,")?.[1];

        if (contentType && base64FileData) {
          const fileName = nanoid();
          const ext = contentType.split("/")[1];
          const path = `${fileName}.${ext}`;

          const { data, error: uploadError } = await supabase.storage
            .from(env.SUPABASE_BUCKET)
            .upload(path, decode(base64FileData), {
              contentType,
              upsert: true,
            });
          if (data) {
            imageUrl = `${env.SUPABASE_URL.replace(
              ".co",
              ".co"
            )}/storage/v1/object/public/${env.SUPABASE_BUCKET}/${data.path}`;
          }
        }
      }
      const { name, link, notes } = input;
      return ctx.prisma.gift.create({
        data: {
          name,
          link,
          notes,
          image: imageUrl,
          userId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        giftId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.gift.updateMany({
        where: { userId: ctx.session.user.id, id: input.giftId },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
});
