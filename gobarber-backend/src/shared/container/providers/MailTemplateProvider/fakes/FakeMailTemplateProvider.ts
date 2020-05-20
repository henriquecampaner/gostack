import iMailTemplateProvider from '../models/iMailTemplateProvider';

export default class FakeMailTemplenteProvider
  implements iMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail template';
  }
}
