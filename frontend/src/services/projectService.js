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
  },

  getProject: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener el proyecto:', error);
      throw error;
    }
  },

  getProjectCreators: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}/creators`);
      return response.data.data.creators;
    } catch (error) {
      console.error('Error al obtener los creadores del proyecto:', error);
      throw error;
    }
  },

  inviteUser: async (projectId, userId) => {
    try {
      const response = await axiosInstance.post(`/api/projects/${projectId}/invite`, { userId });
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('El usuario ya es parte del proyecto');
      }
      throw error;
    }
  },

  removeProjectMember: async (projectId, userId) => {
    try {
      const response = await axiosInstance.delete(`/api/projects/${projectId}/members/${userId}`);
      notify.success('Usuario eliminado del proyecto exitosamente');
      return response.data.data;
    } catch (error) {
      notify.error('Error al eliminar el usuario del proyecto');
      throw error;
    }
  },

  isOriginalCreator: async (projectId, userId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}`);
      const project = response.data.data;
      return project.creators[0] === userId;
    } catch (error) {
      console.error('Error al verificar el creador original:', error);
      return false;
    }
  },

  removeMember: async (projectId, userId) => {
    try {
      console.log('Removing member:', {
        projectId,
        userId,
      });
      
      const response = await axiosInstance.delete(`/api/projects/${projectId}/members/${userId}`);
      notify.success('Miembro eliminado exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error removing member:', error.response?.data || error);
      if (error.response?.status === 403) {
        notify.error(error.response.data.message || 'No tienes permisos para realizar esta acción');
      } else {
        notify.error('Error al eliminar el miembro');
      }
      throw error;
    }
  },

  uploadImage: async (formData) => {
    try {
      console.log('Sending FormData with entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axiosInstance.post('/api/projects/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [(data) => data],
      });
      
      console.log('Upload response:', response);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
}; 