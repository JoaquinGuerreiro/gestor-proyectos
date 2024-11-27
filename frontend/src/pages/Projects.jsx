import { useState } from 'react';
import { PageContainer, ContentCard, SectionHeader, SectionTitle, ActionButton } from '../styles/shared';
import ProjectList from '../components/projects/ProjectList';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import styled from 'styled-components';

const ProjectsWrapper = styled(PageContainer)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow-x: hidden;
`;

const ProjectContent = styled(ContentCard)`
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const handleProjectCreated = () => {
    setIsModalOpen(false);
    setShouldRefresh(prev => !prev);
  };

  return (
    <ProjectsWrapper>
      <SectionHeader>
        <SectionTitle>Mis Proyectos</SectionTitle>
        <ActionButton onClick={() => setIsModalOpen(true)}>
          Crear Proyecto
        </ActionButton>
      </SectionHeader>

      <ProjectContent>
        <ProjectList refreshTrigger={shouldRefresh} />
      </ProjectContent>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </ProjectsWrapper>
  );
}

export default Projects; 