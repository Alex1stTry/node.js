import { NextFunction, Request, Response } from "express";

import { IForgot, ISetForgot } from "../interfaces/forgot.interface";
import { IJWTPayload } from "../interfaces/jwtPayload.interface";
import { IToken } from "../interfaces/token.interface";
import { ILogin, IUser } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IUser>;
      const newUser = await authService.signUp(dto);
      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  }
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ILogin;
      const user = await authService.signIn(dto);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }
  public async refresh(req: Request, res: Response, next: NextFunction) {
    const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
    const tokenPair = req.res.locals.tokenPair as IToken;
    const data = await authService.refresh(jwtPayload, tokenPair);
    res.status(201).json(data);
  }
  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IForgot;
      await authService.forgotPassword(body);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as ISetForgot;
      const jwtPayload = req.res.locals.jwtPayload;
      await authService.setForgotPassword(body, jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}
export const authController = new AuthController();
