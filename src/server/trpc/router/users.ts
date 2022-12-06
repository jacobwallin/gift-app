import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { NOT: { id: ctx.session.user.id } },
      orderBy: { name: "asc" },
    });
  }),
  getOne: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
});
