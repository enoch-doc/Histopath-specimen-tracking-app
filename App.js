import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import useAuthStore from './src/store/authStore';
import { COLORS } from './src/constants/theme';

export default function App() {
  const { user, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check if user is already logged in
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // If user is logged in, we'll show Dashboard (coming next)
  // For now, just show login
  if (user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome {user.full_name}!</Text>
        <Text>Dashboard coming next...</Text>
      </View>
    );
  }

  // Show login screen
  return <LoginScreen />;
}