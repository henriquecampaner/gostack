import { getRepository, Repository, Not } from 'typeorm';

import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import iUsersRepository from '@modules/users/repositories/iUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import iFindAllProvidersDTO from '../../../dtos/iFindAllProvidersDTO';

class UsersRepository implements iUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async create({
    name,
    email,
    password,
  }: iCreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findAllProviders({
    except_user_id,
  }: iFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }
}

export default UsersRepository;
