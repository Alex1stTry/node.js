import jsomwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwtPayload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  public generateTokens(payload: IJWTPayload): ITokenResponse {
    const accessToken = jsomwebtoken.sign(payload, config.TOKEN_ACCESS_SECRET, {
      expiresIn: config.ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsomwebtoken.sign(
      payload,
      config.TOKEN_REFRESH_SECRET,
      {
        expiresIn: config.REFRESH_EXPIRES_IN,
      },
    );
    return {
      accessToken,
      accessExpires: config.ACCESS_EXPIRES_IN,
      refreshToken,
      refreshExpires: config.REFRESH_EXPIRES_IN,
    };
  }
  public checkToken(token: string, type: TokenTypeEnum): IJWTPayload {
    try {
      let secret: string;
      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = config.TOKEN_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = config.TOKEN_REFRESH_SECRET;
          break;
      }
      return jsomwebtoken.verify(token, secret) as IJWTPayload;
    } catch (e) {
      throw new ApiError(401, "invalid token");
    }
  }
}
export const tokenService = new TokenService();
