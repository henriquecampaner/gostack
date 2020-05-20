import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

// import AppError from '@shared/error/AppError';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iUserTokensRepository from '@modules/users/repositories/iUserTokensRepository';
import iHasProvider from '@modules/users/providers/HashProvider/models/iHashProvider';
import AppError from '@shared/error/AppError';

// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPassowrdService {
  constructor(
    @inject('UserRepository')
    private usersRepository: iUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: iUserTokensRepository,

    @inject('HashProvider')
    private hasProvider: iHasProvider,
  ) {}

  async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User token does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hasProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPassowrdService;
