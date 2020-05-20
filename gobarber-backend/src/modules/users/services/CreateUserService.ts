import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import iCacheProvider from '@shared/container/providers/CachProvider/models/iCacheProvider';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iHashProvider from '@modules/users/providers/HashProvider/models/iHashProvider';

import AppError from '@shared/error/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private usersRepository: iUsersRepository,

    @inject('HashProvider')
    private hashProvider: iHashProvider,

    @inject('CacheProvider')
    private cacheProvider: iCacheProvider,
  ) {}

  async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already in use');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidadePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
