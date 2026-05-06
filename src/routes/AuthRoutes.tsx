import { createStackNavigator } from '@react-navigation/stack';
// Importe suas telas de Login e Cadastro aqui
import { View, Text } from 'react-native';

// Telas temporárias para teste
const LoginScreen = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Tela de Login</Text></View>;
const RegisterScreen = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Tela de Registro</Text></View>;
const HomeScreen = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Tela Home</Text></View>;
const UserOccurrences = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Minhas Ocorrências</Text></View>;
//-------------------------apagar depois---------------------------------------

const Stack = createStackNavigator();

export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}