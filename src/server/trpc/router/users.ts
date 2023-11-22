import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.email === "fettermann@gmail.com") {
      return ctx.prisma.user.findMany({
        where: {
          NOT: [
            { id: ctx.session.user.id },
            { email: "nancy.zegarski@gmail.com" },
          ],
        },
        orderBy: { name: "asc" },
      });
    } else if (ctx.session.user.email === "nancy.zegarski@gmail.com") {
      return ctx.prisma.user.findMany({
        where: {
          NOT: [{ id: ctx.session.user.id }, { email: "fettermann@gmail.com" }],
        },
        orderBy: { name: "asc" },
      });
    }
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
