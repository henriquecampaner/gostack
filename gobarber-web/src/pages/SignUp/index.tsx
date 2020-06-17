import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// Components
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
// Toast
import { useToast } from '../../hooks/Toast';
// Validation
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

// Styles
import { Container, Content, Background, AnimationContainer } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
          password: Yup.string().min(6, 'Password has to have min 6 digits'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Registration completed',
          description:
            'Registration is done, now you can log into the application.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Something went wrong',
          description: 'Check the data provided.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Register</h1>

            <Input name="name" placeholder="Your name" icon={FiUser} />
            <Input name="email" placeholder="Your e-mail" icon={FiMail} />
            <Input
              name="password"
              type="password"
              placeholder="Your password"
              icon={FiLock}
            />

            <Button type="submit">Register</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Go back login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
