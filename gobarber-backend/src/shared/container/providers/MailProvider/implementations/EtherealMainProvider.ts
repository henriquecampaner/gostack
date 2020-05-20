import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import iMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

import iMailProvider from '@shared/container/providers/MailProvider/models/iMailProvider';
import iSendMailDTO from '../dtos/iSendMailDTO';

@injectable()
export default class EtherealMainProvider implements iMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: iMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: iSendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'GoBarber Staff',
        address: from?.email || 'staff@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: ', message.messageId);
    console.log('Message url:', nodemailer.getTestMessageUrl(message));
  }
}
