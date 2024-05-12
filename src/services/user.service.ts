import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async getById(id: string): Promise<IUser> {
    return await this.isUserHere(id);
  }
  public async getMe(id: string): Promise<IUser> {
    return await this.isUserHere(id);
  }

  public async deleteMe(id: string): Promise<void> {
    await this.isUserHere(id);
    await tokenRepository.deleteByMe(id);
    return await userRepository.delete(id);
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError(409, "email already exist");
    }
  }

  public async isUserHere(id: string): Promise<IUser> {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    return user;
  }

  public async updateMe(id: string, dto: Partial<IUser>) {
    await this.isUserHere(id);
    return await userRepository.update(id, dto);
  }
}

export const userService = new UserService();
