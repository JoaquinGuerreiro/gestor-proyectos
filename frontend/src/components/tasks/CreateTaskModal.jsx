import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { notify } from '../../services/notificationService';
import LoadingSpinner from '../ui/LoadingSpinner';
import styled from 'styled-components';

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
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${props => props.$variant === 'secondary' 
    ? 'transparent' 
    : props.theme.colors.primary};
  color: ${props => props.$variant === 'secondary' 
    ? props.theme.colors.primary 
    : 'white'};
  border: ${props => props.$variant === 'secondary' 
    ? `1px solid ${props.theme.colors.primary}` 
    : 'none'};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'medium',
    dueDate: ''
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response);
        setLoadingProjects(false);
      } catch (error) {
        notify.error('Error al cargar los proyectos');
        setLoadingProjects(false);
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.project) {
      notify.error('Debes seleccionar un proyecto');
      return;
    }

    setLoading(true);
    try {
      await taskService.createTask(formData);
      notify.success('Tarea creada exitosamente');
      onTaskCreated?.();
      onClose();
      setFormData({
        title: '',
        description: '',
        project: '',
        priority: 'medium',
        dueDate: ''
      });
    } catch (error) {
      notify.error('Error al crear la tarea');
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
        <Title>Crear Nueva Tarea</Title>
        
        {loadingProjects ? (
          <LoadingSpinner />
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="project">Proyecto *</Label>
              <Select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un proyecto</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingresa el título de la tarea"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Descripción</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe la tarea..."
                rows={4}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                id="priority"
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
              <Label htmlFor="dueDate">Fecha de vencimiento</Label>
              <Input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>

            <ButtonGroup>
              <Button 
                type="button" 
                onClick={onClose}
                disabled={loading}
                $variant="secondary"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Tarea'}
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default CreateTaskModal; 