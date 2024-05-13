import jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { statusCodes } from "../const/statusCodes.constant";
import { ActionTokenTypeEnum } from "../enums/action.token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwtPayload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  public generateTokens(payload: IJWTPayload): ITokenResponse {
    const accessToken = jsonwebtoken.sign(payload, config.TOKEN_ACCESS_SECRET, {
      expiresIn: config.ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken.sign(
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
        default:
          throw new ApiError(401, "Invalid token type");
      }
      return jsonwebtoken.verify(token, secret) as IJWTPayload;
    } catch (e) {
      throw new ApiError(401, "invalid token");
    }
  }
  public genereteActionToken(
    payload: IJWTPayload,
    type: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;
    switch (type) {
      case ActionTokenTypeEnum.FORGOT:
        secret = config.TOKEN_ACTION_SECRET;
        expiresIn = config.ACTION_EXPIRES_IN;
        break;
      default:
        throw new ApiError(statusCodes.INTERNAL_SERVER_ERROR, "Invalid type");
    }
    return jsonwebtoken.sign(payload, secret, { expiresIn });
  }
  public checkActionToken(
    token: string,
    type: ActionTokenTypeEnum,
  ): IJWTPayload {
    let secret: string;
    try {
      switch (type) {
        case ActionTokenTypeEnum.FORGOT:
          secret = config.TOKEN_ACTION_SECRET;
          break;
        default:
          throw new ApiError(
            statusCodes.INTERNAL_SERVER_ERROR,
            "invalid token type",
          );
      }
      return jsonwebtoken.verify(token, secret) as IJWTPayload;
    } catch (e) {
      throw new ApiError(statusCodes.UNAUTHORIZED, "token isn`t valid");
    }
  }
}
export const tokenService = new TokenService();
