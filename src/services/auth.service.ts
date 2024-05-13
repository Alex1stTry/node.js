import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/action.token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IForgot, ISetForgot } from "../interfaces/forgot.interface";
import { IJWTPayload } from "../interfaces/jwtPayload.interface";
import { IToken, ITokenResponse } from "../interfaces/token.interface";
import { ILogin, IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.reposytory";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { sendGridService } from "./send-grid.service";
import { smsService } from "./sms.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    await this.isEmailExist(dto.email);
    const hashedPassword = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    await sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
      name: dto.name,
      frontUrl: config.FRONT_URL,
    });
    await smsService.sendSms(user.phone, "Welcome");
    return { user, tokens };
  }
  public async signIn(
    dto: ILogin,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const user = await userRepository.getByParams({ email: dto.email });

    if (!user) {
      throw new ApiError(401, "email or password is wrong");
    }
    const isCompare = await passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isCompare) {
      throw new ApiError(401, "email or password is wrong");
    }
    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return { user, tokens };
  }
  public async refresh(
    jwtPayload: IJWTPayload,
    oldPair: IToken,
  ): Promise<ITokenResponse> {
    const newPair = tokenService.generateTokens({
      userId: jwtPayload.userId,
      role: jwtPayload.role,
    });
    await tokenRepository.deleteById(oldPair._id);
    await tokenRepository.create({
      ...newPair,
      _userId: jwtPayload.userId,
    });
    return newPair;
  }
  public async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError(409, "email already exist");
    }
  }
  public async forgotPassword(dto: IForgot): Promise<void> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) return;
    const actionToken = tokenService.genereteActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT,
    );
    await sendGridService.sendByType(user.email, EmailTypeEnum.RESSET, {
      name: user.name,
      frontUrl: config.FRONT_URL,
      actionToken,
    });
    await actionTokenRepository.create({
      _userId: user._id,
      actionToken,
      actionTokenType: ActionTokenTypeEnum.FORGOT,
    });
  }
  public async setForgotPassword(
    body: ISetForgot,
    payload: IJWTPayload,
  ): Promise<void> {
    const user = await userRepository.getById(payload.userId);
    const hashedPassword = await passwordService.hashPassword(body.password);
    await userRepository.update(user._id, { password: hashedPassword });

    await actionTokenRepository.deleteByParams({
      actionTokenType: ActionTokenTypeEnum.FORGOT,
    });
    await tokenRepository.deleteByParams({ _userId: user._id });
  }
}
export const authService = new AuthService();
