import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import aws from 'aws-sdk';

import mailConfig from '@config/mail';

import iMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

import iMailProvider from '@shared/container/providers/MailProvider/models/iMailProvider';
import iSendMailDTO from '../dtos/iSendMailDTO';

@injectable()
export default class SESMainProvider implements iMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: iMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'eu-west-2',
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: iSendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
