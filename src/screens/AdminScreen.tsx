//Isso é um exemplo de tela de Admin. Você pode personalizá-la como quiser.
import React from 'react';
import { View, Text, Button } from 'react-native';
import { authService } from '../service/authService';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo à Home!</Text>
      <Button title="Sair" onPress={() => authService.logout()} />
    </View>
  );
}
