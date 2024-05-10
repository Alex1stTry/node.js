import { NextFunction, Request, Response } from "express";

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
    const data = authService.refresh(jwtPayload, tokenPair);
    res.status(201).json(data);
  }
}
export const authController = new AuthController();
