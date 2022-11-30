import { router } from "../trpc";
import { authRouter } from "./auth";
import { giftRouter } from "./gifts";

export const appRouter = router({
  gifts: giftRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
