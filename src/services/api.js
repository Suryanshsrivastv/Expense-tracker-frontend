// src/services/api.js
import axios from 'axios';

const API_URL = 'https://expense-tracker-backend-dn1i.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`)
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard'),
  getMonthlyData: (year) => api.get(`/dashboard/monthly${year ? `?year=${year}` : ''}`),
  getCategoryData: () => api.get('/dashboard/categories')
};

export default api;