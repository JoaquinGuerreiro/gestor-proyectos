import { useEffect } from 'react';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';

const ProjectGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1rem;
  justify-content: center;
  width: 100%;
  
  @media (max-width: 1024px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

function ProjectList({ projects, onProjectDeleted, onProjectUpdated }) {
  useEffect(() => {
    console.log('ProjectList recibió nuevos proyectos:', projects);
  }, [projects]);

  return (
    <ProjectGrid>
      {projects.map(project => (
        <ProjectCard
          key={project._id}
          project={project}
          onProjectDeleted={onProjectDeleted}
          onProjectUpdated={onProjectUpdated}
        />
      ))}
    </ProjectGrid>
  );
}

export default ProjectList; 