import type { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie'; 
import api from './axios';

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('bearer_token'); // Or whatever your cookie name is
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to clear store and redirect to login if token expires
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);