import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { projectService } from '../../services/projectService';
import { notify } from '../../services/notificationService';
import { TECHNOLOGIES_OPTIONS, CATEGORY_OPTIONS } from '../../utils/projectOptions';
import InviteUsersModal from './InviteUsersModal';

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
  padding: 1rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  margin: auto;
  position: relative;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 12px 12px 0 0;
  z-index: 1;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 0 0 12px 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const MultiSelect = styled(Select)`
  height: auto !important;
  min-height: 120px !important;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.$variant === 'secondary' 
    ? `
      background: #e2e8f0;
      color: #4a5568;
      &:hover {
        background: #cbd5e0;
      }
    `
    : `
      background: ${props.theme.colors.primary};
      color: white;
      &:hover {
        background: ${props.theme.colors.primary}dd;
      }
    `
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

function EditProjectModal({ project, onClose, onProjectUpdated }) {
  const [formData, setFormData] = useState({
    name: project.name || '',
    description: project.description || '',
    technologies: project.technologies || [],
    category: project.category || '',
    repositoryUrl: project.repositoryUrl || '',
    imageUrl: project.imageUrl || '',
    isPublic: project.isPublic || false
  });
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(project.imageUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'technologies') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        technologies: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedImageUrl = formData.imageUrl;

      if (selectedFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', selectedFile);
        
        const uploadResponse = await projectService.uploadImage(formDataImage);
        updatedImageUrl = uploadResponse.data.imageUrl;
      }

      const updatedData = {
        ...formData,
        imageUrl: updatedImageUrl
      };

      const updatedProject = await projectService.updateProject(project._id, updatedData);
      
      if (onProjectUpdated) {
        onProjectUpdated(updatedProject);
      }

      notify.success('Proyecto actualizado exitosamente');
      onClose();
    } catch (error) {
      notify.error('Error al actualizar el proyecto');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdate = () => {
    onProjectUpdated && onProjectUpdated();
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== project.imageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, project.imageUrl]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Editar Proyecto</h2>
        </ModalHeader>

        <ModalBody>
          <form id="editProjectForm" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                placeholder="Describe tu proyecto..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="technologies">Tecnologías</Label>
              <MultiSelect
                id="technologies"
                name="technologies"
                multiple
                value={formData.technologies}
                onChange={handleChange}
                required
              >
                {TECHNOLOGIES_OPTIONS.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </MultiSelect>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">Categoría</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="repositoryUrl">URL del Repositorio</Label>
              <Input
                type="url"
                id="repositoryUrl"
                name="repositoryUrl"
                value={formData.repositoryUrl}
                onChange={handleChange}
                placeholder="https://github.com/usuario/repositorio"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="image">Imagen del Proyecto</Label>
              <Input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      objectFit: 'cover' 
                    }} 
                  />
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Proyecto Público
              </Label>
            </FormGroup>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button 
            type="button" 
            onClick={onClose} 
            $variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="editProjectForm"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </ModalFooter>

        <Button
          type="button"
          onClick={() => setShowInviteModal(true)}
          style={{ marginTop: '1rem' }}
        >
          Invitar Usuarios
        </Button>
        
        {showInviteModal && (
          <InviteUsersModal
            projectId={project._id}
            onClose={() => setShowInviteModal(false)}
            onProjectUpdated={handleProjectUpdate}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default EditProjectModal; 