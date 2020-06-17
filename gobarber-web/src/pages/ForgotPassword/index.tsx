import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';
// Components
import Button from '../../components/Button';
import Input from '../../components/Input';
// Toasts
import { useToast } from '../../hooks/Toast';
// Validation
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

// Styles
import { Container, Content, Background, AnimationContainer } from './styles';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Recovery email sent',
          description: `We sent an email to ${data.email}, check your inbox.`,
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
          title: 'Recovery password error',
          description:
            'An error occurred while trying to recover your password, try again',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Recovery Password</h1>

            <Input name="email" placeholder="Your e-mail" icon={FiMail} />

            <Button type="submit" loading={loading}>
              Recovery
            </Button>
          </Form>

          <Link to="/sign-up">
            <FiLogIn />
            Go Back to Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
