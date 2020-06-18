import React from 'react';

import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    // pega funcoes de dentro
    Link: ({ children }: { children: React.ReactNode }) => children,
    // Para componentes de lib que recebem alguma coisa
  };
});
// moca uma lib

jest.mock('../../hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Your e-mail');
    const passwordField = getByPlaceholderText('Your password');
    const buttonElement = getByText('Login');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    // Preenche os inputs

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('Your e-mail');
    const passwordField = getByPlaceholderText('Your password');
    const buttonElement = getByText('Login');

    fireEvent.change(emailField, { target: { value: 'email-invalid' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    // Preenche os inputs

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const emailField = getByPlaceholderText('Your e-mail');
    const passwordField = getByPlaceholderText('Your password');
    const buttonElement = getByText('Login');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
