import React , { useRef, useCallback } from 'react';
import { Image,
         View,
         KeyboardAvoidingView,
         Platform,
         ScrollView,
         TextInput,
         Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import logoImg from '../../assets/logo.png';
import getValidationErros from '../../utils/getValidationErrors';
import { Container,
         Title,
         BackToSignIn,
         BackToSignInText
         } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {

  const FormRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        FormRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);
        navigation.goBack();

        Alert.alert('Cadastro ok', 'Faça seu login');

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          console.log(errors);
          FormRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro!'
        );

      }
    },
    [navigation],
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
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form
              ref={FormRef}
              onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => FormRef.current?.submitForm()}
              />

              <Button onPress={() => FormRef.current?.submitForm()}>Entrar</Button>
            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#FFF" />
        <BackToSignInText>
          Voltar para logon
        </BackToSignInText>
      </BackToSignIn>

    </>
  );
};

export default SignUp;
