import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';

// Navegação simples sem biblioteca externa — compatível 100% com Expo Snack
export default function App() {
  const [tela, setTela] = useState('Login');

  const navigation = {
    navigate: (nome) => setTela(nome),
    goBack: () => setTela('Login'),
  };

  if (tela === 'Cadastro') {
    return <CadastroScreen navigation={navigation} />;
  }

  return <LoginScreen navigation={navigation} />;
}
