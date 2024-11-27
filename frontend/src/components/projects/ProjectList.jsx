import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';
import { projectService } from '../../services/projectService';
import { notify } from '../../services/notificationService';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

function ProjectList({ refreshTrigger }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      console.log('Proyectos cargados:', data);
      setProjects(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      notify.error('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  if (loading) {
    return <LoadingMessage>Cargando proyectos...</LoadingMessage>;
  }

  return (
    <ListContainer>
      {projects.map(project => (
        <ProjectCard
          key={project._id}
          project={project}
          onUpdate={fetchProjects}
          showCreator={false}  
        />
      ))}
    </ListContainer>
  );
}

export default ProjectList; 