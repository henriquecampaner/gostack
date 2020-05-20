import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import iMailProvider from './models/iMailProvider';

import EtherealMainProvider from './implementations/EtherealMainProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMainProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<iMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
