import React, { useCallback, useRef } from 'react';
import { Image,
         View,
         KeyboardAvoidingView,
         Platform,
         ScrollView,
         TextInput,
         Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import getValidationErros from '../../utils/getValidationErrors';
import { Container,
         Title,
         ForgotPassword,
         ForgotPasswordText,
         CreateAccountButton,
         CreateAccountButtonText
         } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}


const SignIn: React.FC = () => {
  const FormRef = useRef<FormHandles>(null);
  const PasswordInputRef = useRef<TextInput>(null)
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        FormRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          console.log(errors);
          FormRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login! verifique as credenciais'
        );

      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          // contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={FormRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  PasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={PasswordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="send"
                onSubmitEditing={() => FormRef.current?.submitForm()}
              />

              <Button
                onPress={() => FormRef.current?.submitForm()}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>
                Esqueci minha senha
              </ForgotPasswordText>
            </ForgotPassword>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>
          Criar uma conta
        </CreateAccountButtonText>
      </CreateAccountButton>

    </>
  );
};

export default SignIn;
