import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import ProjectList from '../components/projects/ProjectList';
import TaskList from '../components/tasks/TaskList';
import { useTasks } from '../context/TaskContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { projectService } from '../services/projectService';
import { notify } from '../services/notificationService';
import { PageContainer, ContentCard } from '../styles/shared';
import ProjectCard from '../components/projects/ProjectCard';

const DashboardWrapper = styled(PageContainer)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DashboardContent = styled(ContentCard)`
  padding: 2rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RecentSection = styled.div`
  margin-top: 2rem;

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #2c3e50;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const IntroSection = styled.section`
  margin: 2rem 0;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h1 {
    font-size: 1.75rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #2c3e50;
      
      &::before {
        content: '✓';
        color: #27ae60;
        margin-right: 0.5rem;
      }
    }
  }

  a {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #3498db;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.3s;

    &:hover {
      background: #2980b9;
    }
  }
`;

function Dashboard() {
  const { auth } = useAuth();
  const { addTask, tasks } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'baja',
    dueDate: ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    publicProjects: 0,
    userProjects: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'baja',
      dueDate: ''
    });
  };

  useEffect(() => {
    console.log('Tareas en Dashboard:', tasks);
  }, [tasks]);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await projectService.getProjectStats();
        setStats(statsData);
      } catch (error) {
        notify.error('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!auth?.user) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardWrapper>
      <DashboardContent>
        <IntroSection>
          <h1>¡Organiza y gestiona tus proyectos fácilmente!</h1>
          <p>
            Descubre una herramienta diseñada para facilitar la planificación, el seguimiento y la ejecución de tus proyectos. Controla todos los aspectos de tu trabajo desde una sola plataforma y mantén a tu equipo alineado y productivo.
          </p>
          <ul>
            <li>Gestiona tareas, recursos y documentos de manera eficiente.</li>
            <li>Personaliza la privacidad de tus proyectos según tus necesidades.</li>
            <li>Haz seguimiento en tiempo real de los progresos y objetivos.</li>
            <li>Facilita la colaboración entre los miembros de tu equipo.</li>
          </ul>

        </IntroSection>

        <RecentSection>
          <h2>Tus Proyectos Recientes</h2>
          <ProjectsGrid>
            {projects.map(project => (
              <ProjectCard 
                key={project._id}
                project={project}
                onUpdate={fetchProjects}
                showDeleteButton={false}
                showCreator={false}
              />
            ))}
          </ProjectsGrid>
        </RecentSection>
      </DashboardContent>
    </DashboardWrapper>
  );
}

export default Dashboard;
