import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { projectService } from '../../services/projectService';
import { LoadingButton } from '../ui/LoadingButton';
import { Form, Input, TextArea, ErrorMessage, FormGroup, Label } from '../../styles/shared';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 2px solid ${props => props.$error ? '#dc3545' : '#e0e0e0'};
    border-radius: 8px;
    transition: all 0.2s ease;
    font-size: 1rem;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
      outline: none;
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

function ProjectForm({ onSuccess, initialData = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        await projectService.updateProject(initialData._id, data);
      } else {
        await projectService.createProject(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">Nombre del proyecto</Label>
          <Input
            id="name"
            $error={!!errors.name}
            {...register('name', { 
              required: 'El nombre es requerido',
              minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres'
              }
            })}
            placeholder="Nombre del proyecto"
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Descripción</Label>
          <TextArea
            id="description"
            $error={!!errors.description}
            {...register('description')}
            placeholder="Descripción del proyecto"
          />
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </FormGroup>

        <LoadingButton 
          type="submit" 
          $isLoading={isSubmitting}
          $variant="primary"
        >
          {initialData ? 'Actualizar' : 'Crear'} Proyecto
        </LoadingButton>
      </StyledForm>
    </FormContainer>
  );
}

export default ProjectForm; 