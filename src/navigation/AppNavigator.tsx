import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { authService } from '../service/authService';

// Importe suas telas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen.tsx';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Início" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((userLogado: any) => {
      setUser(userLogado);
      if (userLogado && userLogado.email === 'admin@cordel.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : isAdmin ? (
          <Stack.Screen name="AdminRoot" component={AdminScreen} />
        ) : (
          <Stack.Screen name="Main" component={HomeTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
