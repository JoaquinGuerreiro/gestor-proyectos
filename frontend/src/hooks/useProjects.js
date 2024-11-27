import { useState, useEffect, useRef, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { toast } from 'react-toastify';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const cache = useRef(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    const cacheKey = 'projects';
    if (cache.current.has(cacheKey)) {
      setProjects(cache.current.get(cacheKey));
      return;
    }
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      cache.current.set(cacheKey, data);
    } catch (error) {
      setError(error.message);
      toast.error('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (projectData) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects([...projects, newProject]);
      toast.success('Proyecto creado exitosamente');
      return newProject;
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al crear el proyecto');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject
  };
}; 