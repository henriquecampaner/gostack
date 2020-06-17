import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// Components
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
// Auth
import { useAuth } from '../../hooks/Auth';
// Toasts
import { useToast } from '../../hooks/Toast';
// Validation
import getValidationErrors from '../../utils/getValidationErrors';

// Styles
import { Container, Content, Background, AnimationContainer } from './styles';

interface SignInFormData {
  password: string;
  email: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
          password: Yup.string().required('Password is required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        await signIn({
          email: data.email,
          password: data.password,
        });
        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Authentication error',
          description: 'There was an error signing in, check your credentials',
        });
      }
    },
    [signIn, addToast, history],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Login</h1>

            <Input name="email" placeholder="Your e-mail" icon={FiMail} />
            <Input
              name="password"
              type="password"
              placeholder="Your password"
              icon={FiLock}
            />

            <Button type="submit">Login</Button>

            <Link to="/forgot-password">I forgot my password</Link>
          </Form>

          <Link to="/sign-up">
            <FiLogIn />
            Create new account
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
