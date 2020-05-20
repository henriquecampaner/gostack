import handlebars from 'handlebars';
import fs from 'fs';

import iMailTemplateProvider from '../models/iMailTemplateProvider';
import iParseMailTemplateDTO from '../dtos/iParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider
  implements iMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: iParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTempalte = handlebars.compile(templateFileContent);

    return parseTempalte(variables);
  }
}
