import AppError from '@shared/error/AppError';
import FakeCacheProvider from '@shared/container/providers/CachProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

import FakerHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakerHashProvider: FakerHashProvider;
let createUserservice: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakerHashProvider = new FakerHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserservice = new CreateUserService(
      fakeUsersRepository,
      fakerHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserservice.execute({
      email: 'henrique@live.com',
      name: 'Henrique',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user if the email already exist', async () => {
    const user = await createUserservice.execute({
      email: 'henrique@live.com',
      name: 'Henrique',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    await expect(
      createUserservice.execute({
        email: 'henrique@live.com',
        name: 'Henrique',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
