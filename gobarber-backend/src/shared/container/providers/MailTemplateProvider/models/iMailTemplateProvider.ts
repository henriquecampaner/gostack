import IParseTemplateDTO from '../dtos/iParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseTemplateDTO): Promise<string>;
}
