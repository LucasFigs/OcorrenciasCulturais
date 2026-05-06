import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

// 1. As telas temporárias ficam aqui em cima
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tela Home</Text>
  </View>
);

const UserOccurrences = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Minhas Ocorrências</Text>
  </View>
);
//-------------------------apagar depois---------------------------------------

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ocorrencias" component={UserOccurrences} />
    </Tab.Navigator>
  );
}