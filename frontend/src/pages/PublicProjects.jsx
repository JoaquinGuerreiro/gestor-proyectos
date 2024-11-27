import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PageContainer, ContentCard, SectionHeader, SectionTitle } from '../styles/shared';
import ProjectCard from '../components/projects/ProjectCard';
import { projectService } from '../services/projectService';
import { notify } from '../services/notificationService';

const PublicProjectsWrapper = styled(PageContainer)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  margin: 2rem 0;
  font-size: 1.1rem;
`;

function PublicProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getPublicProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching public projects:', error);
      notify.error('Error al cargar los proyectos públicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  return (
    <PublicProjectsWrapper>
      <SectionHeader>
        <SectionTitle>Proyectos Públicos</SectionTitle>
      </SectionHeader>

      <ContentCard>
        {loading ? (
          <EmptyMessage>Cargando proyectos...</EmptyMessage>
        ) : projects.length > 0 ? (
          <ProjectsGrid>
            {projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                showDeleteButton={false}
                showEditButton={false}
              />
            ))}
          </ProjectsGrid>
        ) : (
          <EmptyMessage>No hay proyectos públicos disponibles</EmptyMessage>
        )}
      </ContentCard>
    </PublicProjectsWrapper>
  );
}

export default PublicProjects; 