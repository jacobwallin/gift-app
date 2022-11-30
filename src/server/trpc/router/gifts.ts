import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const giftRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.gift.findMany({
      where: { userId: ctx.session.user.id, deletedAt: null },
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
      ctx.prisma.gift.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
});
