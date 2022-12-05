import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

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
        link: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.gift.create({
        data: { ...input, userId: ctx.session.user.id },
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
