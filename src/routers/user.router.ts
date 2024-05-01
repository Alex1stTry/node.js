import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleWare } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getAll);
router.get("/:id", commonMiddleWare.isIdValid, userController.getById);
router.delete("/:id", commonMiddleWare.isIdValid, userController.delete);
router.post("/", userController.create);
router.put("/:id", commonMiddleWare.isIdValid, userController.update);

export const userRouter = router;
