import { RoleEnum } from "../enums/role-enum";

export interface IUser {
  name: string;
  _id: string;
  age: number;
  email: string;
  password: string;
  phone: string;
  role: RoleEnum;
  isDeleted: boolean;
  isVerified: boolean;
}
export interface ILogin {
  email: string;
  password: string;
}
