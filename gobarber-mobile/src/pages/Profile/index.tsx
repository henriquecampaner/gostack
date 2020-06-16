/* eslint-disable no-console */
import React, { useRef, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import ImagePicker from 'react-native-image-picker';

import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import getValidationError from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface ProfileData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  old_password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const { user, updatedUser } = useAuth();

  const emailInputRef = useRef<TextInput>(null);
  const old_passwordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirm_passwordInputRef = useRef<TextInput>(null);

  const handleSignup = useCallback(
    async (data: ProfileData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
          password_old: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val,
            then: Yup.string().required('Password is required'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val,
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

        Alert.alert('Profile updated', 'Your profile has benn updated');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const erros = getValidationError(err);
          formRef.current?.setErrors(erros);
          return;
        }

        Alert.alert('Update Error', 'Something went wrong, try again');
      }
    },
    [navigation, updatedUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Select an avatar',
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Use Camera',
        chooseFromLibraryButtonTitle: 'Choose from galery',
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          Alert.alert('Update avatar Error');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api
          .patch('/users/avatar', data)
          .then((apiResponse) => {
            updatedUser(apiResponse.data);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    );
  }, [updatedUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>My profile</Title>
            </View>
            <Form initialData={user} ref={formRef} onSubmit={handleSignup}>
              <Input
                name="name"
                icon="user"
                placeholder="Your Name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />

              <Input
                name="email"
                icon="mail"
                placeholder="Your Email"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                ref={emailInputRef}
                onSubmitEditing={() => {
                  old_passwordInputRef.current?.focus();
                }}
              />

              <Input
                containerStyle={{ marginTop: 16 }}
                ref={old_passwordInputRef}
                name="old_password"
                icon="lock"
                placeholder="Your actual password"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="New Password"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirm_passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={confirm_passwordInputRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirm the new Password"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirm changes
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
