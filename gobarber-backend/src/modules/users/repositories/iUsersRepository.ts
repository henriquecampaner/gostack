import User from '@modules/users/infra/typeorm/entities/User';
import ICreateDTO from '@modules/users/dtos/iCreateUserDTO';

import iFindAllProvidersDTO from '../dtos/iFindAllProvidersDTO';

export default interface IUserRepository {
  findAllProviders(data: iFindAllProvidersDTO): Promise<User[]>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(data: ICreateDTO): Promise<User>;
  save(user: User): Promise<User>;
}
