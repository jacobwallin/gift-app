import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { router, protectedProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";

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
