import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequired } from "./pick-required-type";

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.RESSET]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
  [EmailTypeEnum.DELETE]: PickRequired<EmailCombinedPayloadType, "name">;
};
