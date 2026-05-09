import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { authService } from '../services/authService';
import { AuthRoutes } from './AuthRoutes';
import { AppRoutes } from './AppRoutes';
// Importe a rota do Admin separada se preferir

export function Routes() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usa a função de persistência que configuramos
    const unsubscribe = authService.checkSession((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Ou um componente de Loading

  return (
    <NavigationContainer>
      {/* Redirecionamento automático conforme perfil */}
      {user ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}