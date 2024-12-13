import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor - Token:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Interceptor - Config:', {
      method: config.method,
      url: config.url,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Interceptor - Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance; 