import iParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/iParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: iParseMailTemplateDTO;
}
