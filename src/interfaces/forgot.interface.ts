import { IUser } from "./user.interface";

interface IForgot extends Pick<IUser, "email"> {}

interface ISetForgot {
  password: string;
}
export { IForgot, ISetForgot };
