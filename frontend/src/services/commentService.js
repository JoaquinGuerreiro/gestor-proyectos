import axiosInstance from '../utils/axios';
import { notify } from './notificationService';

export const commentService = {
  getComments: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}/comments`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  },

  addComment: async (projectId, content) => {
    try {
      const response = await axiosInstance.post(`/api/projects/${projectId}/comments`, {
        content
      });
      notify.success('Comentario añadido exitosamente');
      return response.data.data;
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      notify.error('Error al añadir el comentario');
      throw error;
    }
  },

  deleteComment: async (projectId, commentId) => {
    try {
      await axiosInstance.delete(`/api/projects/${projectId}/comments/${commentId}`);
      notify.success('Comentario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      notify.error('Error al eliminar el comentario');
      throw error;
    }
  }
}; 