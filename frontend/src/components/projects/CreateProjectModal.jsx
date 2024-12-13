import { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import styled from 'styled-components';
import { notify } from '../../services/notificationService';
import { TECHNOLOGIES_OPTIONS, CATEGORY_OPTIONS } from '../../utils/projectOptions';

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
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const MultiSelect = styled(Select)`
  height: auto;
  min-height: 120px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.$variant === 'secondary' ? `
    background: #e2e8f0;
    color: #4a5568;
    &:hover {
      background: #cbd5e0;
    }
  ` : `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: [],
    category: '',
    repositoryUrl: '',
    imageUrl: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProject = await projectService.createProject(formData);
      notify.success('Proyecto creado exitosamente');
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      notify.error('Error al crear el proyecto');
    } finally {
      setLoading(false);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file);
      setSelectedFile(file);
      
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      
      const formData = new FormData();
      formData.append('image', file, file.name);
      
      try {
        const response = await projectService.uploadImage(formData);
        console.log('Upload response:', response);
        if (response.data?.imageUrl) {
          setFormData(prev => ({
            ...prev,
            imageUrl: response.data.imageUrl
          }));
          notify.success('Imagen subida correctamente');
        }
      } catch (error) {
        console.error('Upload error:', error);
        notify.error(error.response?.data?.message || 'Error al subir la imagen');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Crear Nuevo Proyecto</h2>
        </ModalHeader>

        <ModalBody>
          <form id="createProjectForm" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del proyecto"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu proyecto..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="technologies">Tecnologías Utilizadas</Label>
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
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={previewUrl}
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px'
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
            form="createProjectForm"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CreateProjectModal; 