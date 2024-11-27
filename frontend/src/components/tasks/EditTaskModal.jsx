import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { notify } from '../../services/notificationService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  
  background-color: ${props => props.$variant === 'secondary' 
    ? 'transparent' 
    : props.theme.colors.primary};
  color: ${props => props.$variant === 'secondary' 
    ? props.theme.colors.primary 
    : 'white'};
  border: ${props => props.$variant === 'secondary' 
    ? `1px solid ${props.theme.colors.primary}` 
    : 'none'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

function EditTaskModal({ isOpen, onClose, taskData, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    title: taskData.title,
    description: taskData.description || '',
    priority: taskData.priority,
    dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : '',
    project: taskData.project._id
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response);
      } catch (error) {
        notify.error('Error al cargar los proyectos');
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await taskService.updateTask(taskData._id, formData);
      notify.success('Tarea actualizada exitosamente');
      onTaskUpdated();
      onClose();
    } catch (error) {
      notify.error('Error al actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Editar Tarea</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Proyecto</Label>
            <Select
              name="project"
              value={formData.project}
              onChange={handleChange}
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Título</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Descripción</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </FormGroup>

          <FormGroup>
            <Label>Prioridad</Label>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Fecha de vencimiento</Label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose} $variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default EditTaskModal; 