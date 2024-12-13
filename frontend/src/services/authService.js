import axiosInstance from '../utils/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Función auxiliar para asegurar que las URLs de imagen sean absolutas
const ensureAbsoluteImageUrl = (user) => {
  if (user && user.imageUrl && !user.imageUrl.startsWith('http')) {
    user.imageUrl = `${API_URL}${user.imageUrl}`;
  }
  return user;
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      if (response.data.status === 'success') {
        const user = ensureAbsoluteImageUrl(response.data.data);
        return user;
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
        // Asegurar URL absoluta de imagen antes de guardar
        const userWithAbsoluteUrl = ensureAbsoluteImageUrl(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithAbsoluteUrl));
        return { token, user: userWithAbsoluteUrl };
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
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return ensureAbsoluteImageUrl(user);
    } catch (error) {
      console.error('Error al parsear usuario del localStorage:', error);
      return null;
    }
  },

  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/verify');
      if (response.data.status === 'success') {
        const user = ensureAbsoluteImageUrl(response.data.data);
        // Actualizar el localStorage con los datos más recientes
        localStorage.setItem('user', JSON.stringify(user));
        return { status: 'success', data: user };
      }
      return response.data;
    } catch (error) {
      console.error('Error verificando token:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/api/auth/profile', userData);
      if (response.data.status === 'success') {
        const updatedUser = ensureAbsoluteImageUrl(response.data.data);
        // Actualizar el localStorage con los datos más recientes
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } else {
        throw new Error(response.data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error.response?.data?.message || 'Error al actualizar el perfil';
    }
  },

  uploadProfileImage: async (formData) => {
    try {
      const response = await axiosInstance.post('/api/auth/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.status === 'success') {
        const userData = ensureAbsoluteImageUrl(response.data.data);
        // Actualizar el localStorage con la nueva imagen
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return { status: 'success', data: userData };
      } else {
        throw new Error(response.data.message || 'Error al subir la imagen de perfil');
      }
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
      throw error;
    }
  }
};