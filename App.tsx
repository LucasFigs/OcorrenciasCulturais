import React, { useEffect } from 'react';
import { SafeAreaView, Text, Button, Alert, View, StyleSheet } from 'react-native';
import { authService } from './src/service/authService';

const App = () => {
  const handleTesteCadastro = async () => {
    try {
      await authService.signUp("teste@cordel.com", "123456");
      Alert.alert("Sucesso!", "Usuário criado no Firebase!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user: any) => {
      if (user) {
        console.log("Usuário logado:", user.email);
      } else {
        console.log("Nenhum usuário logado.");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Projeto Cordel - Teste Task #3</Text>
        <Button title="Testar Cadastro Firebase" onPress={handleTesteCadastro} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
  