import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// Components
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
// Toasts
import { useToast } from '../../hooks/Toast';
// Validation
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

// Styles
import { Container, Content, Background, AnimationContainer } from './styles';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Password is required'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Password does not match',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');

        addToast({
          type: 'success',
          title: 'Password updated!',
          description:
            'Password has been updated successfully, login with your new password',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Error resetting password',
          description:
            'An error occurred while resetting the password, try again',
        });
      }
    },
    [addToast, location.search, history],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Reset Password</h1>

            <Input
              name="password"
              type="password"
              placeholder="New password"
              icon={FiLock}
            />
            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              icon={FiLock}
            />

            <Button type="submit">Reset</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
