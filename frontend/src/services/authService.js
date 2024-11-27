import axiosInstance from '../utils/axios';

export const authService = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('1. Intentando login con:', {
        email: credentials.email,
        passwordLength: credentials.password?.length
      });

      const response = await axiosInstance.post('/api/auth/login', credentials);
      console.log('2. Respuesta del servidor:', {
        status: response.status,
        success: response.data.status === 'success'
      });
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
      } else {
        throw new Error(response.data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('3. Error detallado:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error.response?.data?.message || 'Credenciales incorrectas';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? JSON.parse(user) : null;
  }
}; 