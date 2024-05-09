import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find({});
  }
  public async getById(id: string): Promise<IUser> {
    return await User.findById(id);
  }
  public async delete(id: string): Promise<void> {
    return await User.findByIdAndDelete(id);
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
  public async update(id: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(id, dto, {
      returnDocument: "after",
    });
  }
}
export const userRepository = new UserRepository();
