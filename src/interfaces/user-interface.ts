import { RoleEnum } from "../enums/role-enum";

export interface IUser {
  _id: string;
  age: number;
  email: string;
  password: string;
  phone: string;
  role: RoleEnum;
  isDeleted: boolean;
  isVerified: boolean;
}
