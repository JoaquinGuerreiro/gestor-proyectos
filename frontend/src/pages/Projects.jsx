import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { projectService } from '../services/projectService';
import ProjectList from '../components/projects/ProjectList';
import ProjectFilters from '../components/projects/ProjectFilters';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { Button } from '../styles/shared';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyMessage from '../components/ui/EmptyMessage';

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

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    console.log('Recibiendo filtros en Projects:', filters);
    setActiveFilters(filters);
    
    // Crear una nueva copia de los proyectos para filtrar
    let filtered = [...projects];
    console.log('Proyectos antes de filtrar:', filtered.length);

    // Aplicar filtros
    if (filters.category) {
      filtered = filtered.filter(project => {
        const match = project.category === filters.category;
        console.log(`Comparando categoría: ${project.category} con ${filters.category} = ${match}`);
        return match;
      });
    }

    if (filters.technology) {
      filtered = filtered.filter(project => 
        project.technologies?.includes(filters.technology)
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(project => 
        project.name?.toLowerCase().includes(searchTerm) ||
        project.description?.toLowerCase().includes(searchTerm)
      );
    }

    console.log('Proyectos después de filtrar:', filtered.length);
    setFilteredProjects(filtered);
  };

  const handleProjectDeleted = (deletedProjectId) => {
    const updatedProjects = projects.filter(p => p._id !== deletedProjectId);
    setProjects(updatedProjects);
    
    const updatedFilteredProjects = filteredProjects.filter(p => p._id !== deletedProjectId);
    setFilteredProjects(updatedFilteredProjects);
  };

  const handleProjectCreated = (newProject) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    if (activeFilters) {
      handleFilterChange(activeFilters);
    } else {
      setFilteredProjects(updatedProjects);
    }
    
    setShowCreateModal(false);
  };

  const handleProjectUpdated = () => {
    loadProjects();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ProjectsContainer>
      <HeaderContainer>
        <h1>Mis Proyectos</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Crear Proyecto
        </Button>
        <ProjectFilters onFilterChange={handleFilterChange} />
      </HeaderContainer>

      <div>
        {filteredProjects.length === 0 && activeFilters ? (
          <EmptyMessage>
            No se encontraron proyectos con los filtros seleccionados.
            <div style={{ marginTop: '1rem', fontSize: '0.9em', color: 'gray' }}>
              Filtros activos: 
              {activeFilters.category && ` Categoría: ${activeFilters.category}`}
              {activeFilters.technology && ` Tecnología: ${activeFilters.technology}`}
              {activeFilters.search && ` Búsqueda: ${activeFilters.search}`}
            </div>
          </EmptyMessage>
        ) : (
          <ProjectList 
            projects={filteredProjects} 
            onProjectDeleted={handleProjectDeleted}
            onProjectUpdated={handleProjectUpdated}
          />
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={() => {
            loadProjects();
            setShowCreateModal(false);
          }}
        />
      )}
    </ProjectsContainer>
  );
}

export default Projects; 