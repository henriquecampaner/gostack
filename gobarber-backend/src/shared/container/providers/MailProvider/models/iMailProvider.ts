import iSendMailDTO from '../dtos/iSendMailDTO';

export default interface IMailProvider {
  sendMail(data: iSendMailDTO): Promise<void>;
}
