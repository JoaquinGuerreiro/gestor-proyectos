import axiosInstance from '../utils/axios';
import { notify } from './notificationService';

const API_URL = 'http://localhost:5000/api/tasks';

export const taskService = {
  getTasks: async () => {
    try {
      console.log('Iniciando getTasks');
      const token = localStorage.getItem('token');
      console.log('Token disponible:', !!token);
      
      const response = await axiosInstance.get(API_URL);
      console.log('Respuesta getTasks:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error detallado en getTasks:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      notify.error('Error al obtener las tareas');
      throw error;
    }
  },

  getTasksByProject: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/tasks/proyecto/${projectId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error en getTasksByProject:', error);
      notify.error('Error al obtener las tareas del proyecto');
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await axiosInstance.post('/api/tasks', taskData);
      notify.success('Tarea creada exitosamente');
      return response.data.data;
    } catch (error) {
      notify.error('Error al crear la tarea');
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await axiosInstance.put(`/api/tasks/${taskId}`, taskData);
      notify.success('Tarea actualizada exitosamente');
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      notify.error('Error al actualizar la tarea');
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      notify.success('Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error en deleteTask:', error);
      notify.error('Error al eliminar la tarea');
      throw error;
    }
  }
}; 