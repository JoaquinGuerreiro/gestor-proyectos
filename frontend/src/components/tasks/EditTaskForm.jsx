import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { taskService } from '../../services/taskService';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  background-color: ${props => props.$variant === 'secondary' 
    ? 'transparent' 
    : props.theme.colors.primary};
  color: ${props => props.$variant === 'secondary' 
    ? props.theme.colors.primary 
    : 'white'};
  border: ${props => props.$variant === 'secondary' 
    ? `1px solid ${props.theme.colors.primary}` 
    : 'none'};
`;

function EditTaskForm({ task, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await taskService.updateTask(task._id, data);
      onSuccess();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>Título</Label>
        <Input
          {...register('title', { required: 'El título es requerido' })}
        />
        {errors.title && <span>{errors.title.message}</span>}
      </FormGroup>

      <FormGroup>
        <Label>Descripción</Label>
        <Input
          as="textarea"
          {...register('description')}
        />
      </FormGroup>

      <FormGroup>
        <Label>Fecha límite</Label>
        <Input
          type="date"
          {...register('dueDate')}
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="submit">Guardar</Button>
        <Button type="button" $variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default EditTaskForm; 