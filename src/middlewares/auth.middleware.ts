import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async isAccessTokenHere(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new ApiError(401, "No token");
      }
      const payload = tokenService.checkToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );
      // console.log(payload); ???
      const tokenPair = await tokenRepository.checkByParams({ accessToken });
      if (!tokenPair) {
        throw new ApiError(401, "invalid token");
      }
      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async isRefreshTokenHere(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.headers.authorization;
      if (!refreshToken) {
        throw new ApiError(401, "No token");
      }
      const payload = tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
      const tokenPair = await tokenRepository.checkByParams({ refreshToken });
      if (!tokenPair) {
        throw new ApiError(401, "invalid token");
      }
      req.res.locals.jwtPayload = payload;
      req.res.locals.tokenPair = tokenPair;
      next();
    } catch (e) {
      next(e);
    }
  }
}
export const authMiddleWare = new AuthMiddleware();
