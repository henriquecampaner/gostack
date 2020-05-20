import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name: 'Henrique',
    email:'henrique@campaner.me',
    password: '12345',
    techs: [
      'NodeJS',
      'ReactJS',
      'React Native',
      { title: 'Javascript', experience: 100 }
    ]
  });

  return response.json({ hi: 'Hello' });
}