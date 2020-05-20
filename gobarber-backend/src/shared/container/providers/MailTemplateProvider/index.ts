import { container } from 'tsyringe';
import iMailTemplateProvider from './models/iMailTemplateProvider';
import HandlebarsMailTemplate from './implementations/HandlebarsMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplate,
};

container.registerSingleton<iMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
