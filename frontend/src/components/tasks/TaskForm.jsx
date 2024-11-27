import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { useState, useEffect } from 'react';
import { notify } from '../../services/notificationService';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
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
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  
  background-color: ${props => props.$variant === 'secondary' 
    ? 'transparent' 
    : props.theme.colors.primary};
  color: ${props => props.$variant === 'secondary' 
    ? props.theme.colors.primary 
    : 'white'};
  border: ${props => props.$variant === 'secondary' 
    ? `2px solid ${props.theme.colors.primary}` 
    : 'none'};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

function TaskForm({ onSuccess, onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      project: '',
      dueDate: '',
      priority: 'medium'
    }
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response);
      } catch (error) {
        notify.error('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log('Datos del formulario:', data); // Para debugging
      if (!data.project) {
        notify.error('Debes seleccionar un proyecto');
        return;
      }

      await taskService.createTask(data);
      notify.success('Tarea creada exitosamente');
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error al crear tarea:', error);
      notify.error('Error al crear la tarea');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>Seleccionar Proyecto *</Label>
        <Select
          {...register('project', { 
            required: 'Debes seleccionar un proyecto' 
          })}
          disabled={loading}
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </Select>
        {errors.project && <ErrorMessage>{errors.project.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>Título *</Label>
        <Input
          type="text"
          placeholder="Ingresa el título de la tarea"
          {...register('title', { 
            required: 'El título es requerido' 
          })}
        />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>Descripción</Label>
        <TextArea
          placeholder="Describe la tarea..."
          {...register('description')}
          rows={4}
        />
      </FormGroup>

      <FormGroup>
        <Label>Prioridad</Label>
        <Select {...register('priority')}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Fecha de vencimiento</Label>
        <Input
          type="date"
          {...register('dueDate')}
          min={new Date().toISOString().split('T')[0]}
        />
      </FormGroup>

      <ButtonGroup>
        <StyledButton 
          type="submit" 
          disabled={loading}
        >
          Crear Tarea
        </StyledButton>
        <StyledButton 
          type="button" 
          $variant="secondary" 
          onClick={onClose}
        >
          Cancelar
        </StyledButton>
      </ButtonGroup>
    </Form>
  );
}

export default TaskForm; 