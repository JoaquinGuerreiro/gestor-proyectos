import { useState } from 'react';
import styled from 'styled-components';
import { taskService } from '../../services/taskService';
import { notify } from '../../services/notificationService';
import EditTaskModal from './EditTaskModal';

const TaskItemContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TaskTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ProjectName = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 500;
`;

const TaskMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const StatusBadge = styled(Badge)`
  background-color: ${props => {
    switch (props.$status) {
      case 'completed': return '#28a745';
      case 'in_progress': return '#ffc107';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const PriorityBadge = styled(Badge)`
  background-color: ${props => {
    switch (props.$priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  }};
  color: white;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.$variant === 'danger' ? '#dc3545' : '#6c757d'};
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function TaskItem({ taskData, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }

    setLoading(true);
    try {
      await taskService.deleteTask(taskData._id);
      notify.success('Tarea eliminada exitosamente');
      onUpdate();
    } catch (error) {
      notify.error('Error al eliminar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    const newStatus = taskData.status === 'completed' ? 'pending' : 'completed';
    setLoading(true);
    try {
      await taskService.updateTask(taskData._id, { status: newStatus });
      notify.success('Estado de la tarea actualizado');
      onUpdate();
    } catch (error) {
      notify.error('Error al actualizar el estado de la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskItemContainer>
      <TaskHeader>
        <TaskInfo>
        <ProjectName>
            📁 {taskData.project?.name || 'Sin proyecto'}
          </ProjectName>
          <TaskTitle>{taskData.title}</TaskTitle>
        </TaskInfo>
        <TaskMeta>
          <StatusBadge $status={taskData.status}>
            {taskData.status === 'completed' ? 'Completada' : 'Pendiente'}
          </StatusBadge>
          <PriorityBadge $priority={taskData.priority}>
            {taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)}
          </PriorityBadge>
        </TaskMeta>
      </TaskHeader>
      {taskData.description && (
        <p>{taskData.description}</p>
      )}
      <Actions>
        <Button
          onClick={() => setIsEditModalOpen(true)}
          disabled={loading}
        >
          ✏️ Editar
        </Button>
        <Button
          onClick={handleStatusChange}
          disabled={loading}
        >
          {taskData.status === 'completed' ? '↩️' : '✓'}
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          $variant="danger"
        >
          🗑️
        </Button>
      </Actions>

      {isEditModalOpen && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          taskData={taskData}
          onTaskUpdated={onUpdate}
        />
      )}
    </TaskItemContainer>
  );
}

export default TaskItem; 