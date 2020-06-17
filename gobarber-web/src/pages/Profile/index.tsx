import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

// Components
import Button from '../../components/Button';
import Input from '../../components/Input';
// Auth
import { useAuth } from '../../hooks/Auth';
// Toast
import { useToast } from '../../hooks/Toast';
// Validation
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

// Styles
import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { user, updatedUser } = useAuth();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
          password_old: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Password is required'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Password is required'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'Password does not match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          email,
          password,
          name,
          password_confirmation,
          old_password,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { password, old_password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updatedUser(response.data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Profile updated',
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
    [addToast, history, updatedUser],
  );

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData();
        data.append('avatar', event.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updatedUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar updated',
          });
        });
      }
    },
    [addToast, updatedUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          onSubmit={handleSubmit}
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img
              src={
                user.avatar_url ||
                'https://api.adorable.io/avatars/400/abott@adorable.io.png'
              }
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Profile</h1>

          <Input name="name" placeholder="Your name" icon={FiUser} />
          <Input name="email" placeholder="Your e-mail" icon={FiMail} />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            type="password"
            placeholder="Your password"
            icon={FiLock}
          />
          <Input
            name="password"
            type="password"
            placeholder="New password"
            icon={FiLock}
          />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirm new password"
            icon={FiLock}
          />

          <Button type="submit">Confirm Changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
