import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { projectService } from '../services/projectService';
import ProjectList from '../components/projects/ProjectList';
import ProjectFilters from '../components/projects/ProjectFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const ProjectsContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  
  h1 {
    margin: 0;
    text-align: center;
  }
`;

function PublicProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getPublicProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    let filtered = [...projects].filter(Boolean);

    if (filters.category) {
      filtered = filtered.filter(project => 
        project?.category === filters.category
      );
    }

    if (filters.technology) {
      filtered = filtered.filter(project => 
        project?.technologies?.includes(filters.technology)
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(project => 
        project?.name?.toLowerCase().includes(searchTerm) ||
        project?.description?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProjects(filtered);
  };

  // Manejador para cuando se elimina un proyecto
  const handleProjectDeleted = (deletedProjectId) => {
    if (!deletedProjectId) return;

    setProjects(prevProjects => 
      prevProjects.filter(project => project?._id !== deletedProjectId)
    );
    
    setFilteredProjects(prevFiltered => 
      prevFiltered.filter(project => project?._id !== deletedProjectId)
    );
  };

  // Manejador para cuando se actualiza un proyecto
  const handleProjectUpdated = (updatedProject) => {
    if (!updatedProject?._id) return;

    setProjects(prevProjects => 
      prevProjects.map(project => 
        project?._id === updatedProject._id ? updatedProject : project
      ).filter(Boolean)
    );
    
    setFilteredProjects(prevFiltered => 
      prevFiltered.map(project => 
        project?._id === updatedProject._id ? updatedProject : project
      ).filter(Boolean)
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ProjectsContainer>
      <HeaderContainer>
        <h1>Proyectos Públicos</h1>
        <ProjectFilters onFilterChange={handleFilterChange} />
      </HeaderContainer>

      <div>
        {filteredProjects.length === 0 && activeFilters ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            No se encontraron proyectos con los filtros seleccionados.
            <div style={{ marginTop: '1rem', fontSize: '0.9em', color: 'gray' }}>
              Filtros activos: 
              {activeFilters.category && ` Categoría: ${activeFilters.category}`}
              {activeFilters.technology && ` Tecnología: ${activeFilters.technology}`}
              {activeFilters.search && ` Búsqueda: ${activeFilters.search}`}
            </div>
          </div>
        ) : (
          <ProjectList 
            projects={filteredProjects}
            onProjectDeleted={handleProjectDeleted}
            onProjectUpdated={handleProjectUpdated}
          />
        )}
      </div>
    </ProjectsContainer>
  );
}

export default PublicProjects; 