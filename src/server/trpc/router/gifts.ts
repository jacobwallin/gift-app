import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { env } from "../../../env/server.mjs";
import ogs from "open-graph-scraper";

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
      where: {
        userId: ctx.session.user.id,
        deletedAt: null,
        suggestedByUserId: null,
      },
      orderBy: { createdAt: "desc" },
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
        include: {
          suggestedBy: true,
        },
      });
    }),

  getMyGifts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.gift.findMany({
      where: { claimedByUserId: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
      include: {
        user: true,
        suggestedBy: true,
      },
    });
  }),
  claim: protectedProcedure
    .input(
      z.object({
        giftId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // can only claim gifts if claimedByUserId is currently null
      return ctx.prisma.gift.updateMany({
        where: { id: input.giftId, claimedByUserId: null },
        data: {
          claimedByUserId: ctx.session.user.id,
        },
      });
    }),
  release: protectedProcedure
    .input(
      z.object({
        giftId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // can only release gifts that have been claimed by the current session user
      return ctx.prisma.gift.updateMany({
        where: { id: input.giftId, claimedByUserId: ctx.session.user.id },
        data: {
          claimedByUserId: null,
        },
      });
    }),
  getMetadata: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ogs({
        url: input.url,
        onlyGetOpenGraphInfo: true,
        fetchOptions: {
          // use iMessage user agent
          headers: {
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0",
          },
        },
      });
      return data;
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
  suggest: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        userId: z.string(),
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
      const { name, link, notes, userId } = input;
      return ctx.prisma.gift.create({
        data: {
          name,
          link,
          notes,
          image: imageUrl,
          userId: userId,
          suggestedByUserId: ctx.session.user.id,
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
  deleteSuggestion: protectedProcedure
    .input(
      z.object({
        giftId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.gift.updateMany({
        where: { suggestedByUserId: ctx.session.user.id, id: input.giftId },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
  setFavorite: protectedProcedure
    .input(
      z.object({
        giftId: z.string(),
        favorite: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.gift.update({
        where: {
          id: input.giftId,
          userId: ctx.session.user.id,
        },
        data: {
          favorite: input.favorite,
        },
      });
    }),
});
