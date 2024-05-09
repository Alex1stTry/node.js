import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwtPayload.interface";
import { IToken, ITokenResponse } from "../interfaces/token.interface";
import { ILogin, IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
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
      userId: dto._id,
      role: dto.role,
    });
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return { user, tokens };
  }
  public async signIn(dto: ILogin): Promise<IUser> {
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
    return user;
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
}
export const authService = new AuthService();
