// src/store/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Login action - MOCK VERSION (will replace with real API later)
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user data based on email
    let mockUser = {
      id: 1,
      email: email,
      full_name: 'Test User',
      role: 'receptionist',
    };
    
    // Assign role based on email for testing
    if (email.includes('receptionist')) {
      mockUser.role = 'receptionist';
      mockUser.full_name = 'Sarah Adeyemi';
    } else if (email.includes('pathologist')) {
      mockUser.role = 'pathologist';
      mockUser.full_name = 'Dr. Ahmed Ibrahim';
    } else if (email.includes('scientist')) {
      mockUser.role = 'lab_scientist';
      mockUser.full_name = 'John Okafor';
    } else if (email.includes('tech')) {
      mockUser.role = 'lab_technician';
      mockUser.full_name = 'Mary Bello';
    } else if (email.includes('admin')) {
      mockUser.role = 'admin';
      mockUser.full_name = 'Admin User';
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    // Save to AsyncStorage
    await AsyncStorage.setItem('authToken', mockToken);
    await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
    
    set({ user: mockUser, token: mockToken, isLoading: false });
    return { success: true };
  },

  // Logout action
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    set({ user: null, token: null });
  },

  // Check if user is already logged in (on app start)
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        set({
          user: JSON.parse(userData),
          token,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;