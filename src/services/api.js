import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Ganti dengan URL backend Laravel kamu nantinya
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor untuk menyertakan token jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;