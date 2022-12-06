import { router } from "../trpc";
import { authRouter } from "./auth";
import { giftRouter } from "./gifts";
import { userRouter } from "./users";

export const appRouter = router({
  gifts: giftRouter,
  auth: authRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
