import 'reflect-metadata';

import AppError from '@shared/error/AppError';
import FakeCacheProvider from '@shared/container/providers/CachProvider/fakes/FakeCacheProvider';
import AuthicateUserService from './AuthicateUserService';
import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakerHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakerHashProvider: FakerHashProvider;

let authicateUser: AuthicateUserService;
let createUser: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakerHashProvider = new FakerHashProvider();

    authicateUser = new AuthicateUserService(
      fakeUsersRepository,
      fakerHashProvider,
    );
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakerHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'henrique@campaner.me',
      password: '1234567',
    });

    const response = await authicateUser.execute({
      email: 'henrique@campaner.me',
      password: '1234567',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with a non existing user', async () => {
    await expect(
      authicateUser.execute({
        email: 'henrique@campaner.me',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'henrique@campaner.me',
      password: '1234567',
    });

    await expect(
      authicateUser.execute({
        email: 'henrique@campaner.me',
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
