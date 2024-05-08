import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleWare } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);
router.get("/:id", commonMiddleWare.isIdValid, userController.getById);
router.delete("/:id", commonMiddleWare.isIdValid, userController.delete);
router.post(
  "/",
  commonMiddleWare.isBodyValid(UserValidator.create),
  userController.create,
);
router.put(
  "/:id",
  commonMiddleWare.isIdValid,
  commonMiddleWare.isBodyValid(UserValidator.update),
  userController.update,
);

export const userRouter = router;
