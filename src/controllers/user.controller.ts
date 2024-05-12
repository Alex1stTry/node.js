import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwtPayload.interface";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (e) {}
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const user = await userService.getById(id);
      if (!user) {
        throw new ApiError(404, "user not found");
      }
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.res.locals.jwtPayload as IJWTPayload;
      const user = await userService.getMe(payload.userId);
      if (!user) {
        throw new ApiError(404, "user not found");
      }
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.res.locals.jwtPayload as IJWTPayload;
      await userService.deleteMe(payload.userId);
      res.status(200).json("user deleted");
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IUser>;
      const payload = req.res.locals.jwtPayload;
      const updatedUser = await userService.updateMe(payload.userId, dto);
      res.status(201).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
