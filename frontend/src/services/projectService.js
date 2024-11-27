import axiosInstance from '../utils/axios';
import { notify } from './notificationService';

export const projectService = {
  getProjects: async () => {
    try {
      const response = await axiosInstance.get('/api/projects');
      console.log('Proyectos obtenidos:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await axiosInstance.post('/api/projects', projectData);
      notify.success('Proyecto creado exitosamente');
      return response.data.data;
    } catch (error) {
      notify.error('Error al crear el proyecto');
      throw error;
    }
  },

  getPublicProjects: async () => {
    try {
      const response = await axiosInstance.get('/api/projects/public');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener proyectos públicos:', error);
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await axiosInstance.put(`/api/projects/${id}`, projectData);
      notify.success('Proyecto actualizado exitosamente');
      return response.data.data;
    } catch (error) {
      notify.error('Error al actualizar el proyecto');
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      await axiosInstance.delete(`/api/projects/${id}`);
      notify.success('Proyecto eliminado exitosamente');
    } catch (error) {
      notify.error('Error al eliminar el proyecto');
      throw error;
    }
  }
}; 