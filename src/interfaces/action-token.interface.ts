import { ActionTokenTypeEnum } from "../enums/action.token-type.enum";

export interface IActionToken {
  _id?: string;
  _userId: string;
  actionToken: string;
  actionTokenType: ActionTokenTypeEnum;
}
