// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We'll update this URL when we deploy backend
// For now, we'll use a placeholder
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development (your computer)
  : 'https://your-backend-url.railway.app/api'; // Production (will update later)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // We'll handle navigation to login later
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// Specimen endpoints
export const specimenAPI = {
  getAll: (filters) => api.get('/specimens', { params: filters }),
  getById: (id) => api.get(`/specimens/${id}`),
  create: (data) => api.post('/specimens', data),
  update: (id, data) => api.put(`/specimens/${id}`, data),
  delete: (id) => api.delete(`/specimens/${id}`),
  getHistory: (id) => api.get(`/specimens/${id}/history`),
  search: (query) => api.get('/specimens/search', { params: { q: query } }),
  getStats: () => api.get('/specimens/stats'),
};

// Tracking endpoints
export const trackingAPI = {
  updateStage: (specimenId, stageData) => 
    api.post('/tracking', { specimenId, ...stageData }),
  addComment: (specimenId, comment) => 
    api.post(`/specimens/${specimenId}/comments`, { comment }),
};

// User endpoints (for admin)
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api; 