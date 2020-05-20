/* eslint-disable prefer-destructuring */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthicateUserService from '@modules/users/services/AuthicateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authicateUser = container.resolve(AuthicateUserService);

    const { user, token } = await authicateUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
