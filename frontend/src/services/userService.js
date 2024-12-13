import axiosInstance from '../utils/axios';

export const userService = {
  getAllUsers: async () => {
    try {
      console.log('Fetching users...');
      const response = await axiosInstance.get('/api/users');
      console.log('Users response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }
}; 