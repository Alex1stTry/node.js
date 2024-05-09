import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleWare } from "../middlewares/auth.middleware";
import { commonMiddleWare } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleWare.isBodyValid(UserValidator.create),
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleWare.isBodyValid(UserValidator.signIn),
  authController.signIn,
);
router.post(
  "/refresh",
  authMiddleWare.isRefreshTokenHere,
  authController.refresh,
);

export const authRouter = router;
