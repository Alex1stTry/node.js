import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleWare } from "../middlewares/auth.middleware";
import { commonMiddleWare } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);
router.get("/me", authMiddleWare.isAccessTokenHere, userController.getMe);
router.delete("/me", authMiddleWare.isAccessTokenHere, userController.deleteMe);
router.put(
  "/me",
  authMiddleWare.isAccessTokenHere,
  commonMiddleWare.isBodyValid(UserValidator.update),
  userController.updateMe,
);

router.get("/:id", commonMiddleWare.isIdValid, userController.getById);

export const userRouter = router;
