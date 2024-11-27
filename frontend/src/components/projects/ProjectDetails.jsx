import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button, StatusBadge } from '../../styles/shared';
import { notify } from '../../services/notificationService';
import { projectService } from '../../services/projectService';
import TaskList from '../tasks/TaskList';
import ProjectForm from './ProjectForm';
import LoadingSpinner from '../ui/LoadingSpinner';
import CreateTaskModal from '../tasks/CreateTaskModal';

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProjectInfo = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProjectTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.dark};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  useEffect(() => {
    cargarProyecto();
  }, [id]);

  const cargarProyecto = async () => {
    try {
      const data = await projectService.getProject(id);
      setProject(data);
    } catch (error) {
      notify.error('Error al cargar el proyecto');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(id);
        notify.success('Proyecto eliminado exitosamente');
        navigate('/projects');
      } catch (error) {
        notify.error('Error al eliminar el proyecto');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedProject = await projectService.updateProject(id, {
        ...project,
        status: newStatus
      });
      setProject(updatedProject);
      notify.success('Estado actualizado exitosamente');
    } catch (error) {
      notify.error('Error al actualizar el estado');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  return (
    <Container>
      <ProjectHeader>
        <div>
          <ProjectTitle>{project.name}</ProjectTitle>
          <StatusBadge $status={project.status}>
            {getStatusText(project.status)}
          </StatusBadge>
        </div>
        <ButtonGroup>
          <Button onClick={() => setShowEditForm(true)}>
            Editar Proyecto
          </Button>
          <Button variant="delete" onClick={handleDelete}>
            Eliminar Proyecto
          </Button>
        </ButtonGroup>
      </ProjectHeader>

      <ProjectInfo>
        <ProjectDescription>{project.description}</ProjectDescription>
        <ButtonGroup>
          <Button
            $variant={project.status === 'pending' ? 'primary' : 'secondary'}
            onClick={() => handleStatusChange('pending')}
          >
            Pendiente
          </Button>
          <Button
            variant={project.status === 'in-progress' ? 'primary' : 'secondary'}
            onClick={() => handleStatusChange('in-progress')}
          >
            En Progreso
          </Button>
          <Button
            variant={project.status === 'completed' ? 'primary' : 'secondary'}
            onClick={() => handleStatusChange('completed')}
          >
            Completado
          </Button>
        </ButtonGroup>
      </ProjectInfo>

      <section>
        <h2>Tareas del Proyecto</h2>
        <Button onClick={() => setShowCreateTaskModal(true)}>
          Crear Nueva Tarea
        </Button>
        
        <TaskList projectId={id} />
        
        {showCreateTaskModal && (
          <CreateTaskModal
            isOpen={showCreateTaskModal}
            onClose={() => setShowCreateTaskModal(false)}
            onTaskCreated={() => {
              setShowCreateTaskModal(false);
              // Recargar las tareas si es necesario
            }}
            projectId={id}
          />
        )}
      </section>

      {showEditForm && (
        <ProjectForm
          project={project}
          onClose={() => setShowEditForm(false)}
          onProjectUpdated={() => {
            cargarProyecto();
            setShowEditForm(false);
          }}
        />
      )}
    </Container>
  );
};

export default ProjectDetails; 