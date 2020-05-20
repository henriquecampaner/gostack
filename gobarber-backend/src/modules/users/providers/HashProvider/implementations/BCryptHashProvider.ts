import { hash, compare } from 'bcryptjs';

import iHashProvider from '../models/iHashProvider';

export default class BCryptHashProvider implements iHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
