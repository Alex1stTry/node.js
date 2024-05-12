import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import SendGrid from "@sendgrid/mail";

import { config } from "../configs/config";
import { emailTemplateConstant } from "../const/email-template.constant";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload-type";

class SendGridService {
  constructor() {
    SendGrid.setApiKey(config.SENDGRID_API_KEY);
  }
  private async send(mail: MailDataRequired) {
    try {
      await SendGrid.send(mail);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  public async sendByType<T extends EmailTypeEnum>(
    to: string,
    type: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const templateId = emailTemplateConstant[type].templateId;
      await this.send({
        from: config.SENDGRID_FROM,
        to,
        templateId,
        dynamicTemplateData,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export const sendGridService = new SendGridService();
