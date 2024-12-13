import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { notify } from '../services/notificationService';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #2563eb;
`;

const DefaultProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
`;

const ImageUploadContainer = styled.div`
  margin: 1rem 0;
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageUploadLabel = styled.label`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-block;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ProfileInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.label`
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  margin: 0;
  color: #333;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled(EditButton)`
  background-color: #666;
  
  &:hover {
    background-color: #555;
  }
`;

function Profile() {
  const { auth, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(auth.user?.imageUrl || null);
  const [formData, setFormData] = useState({
    username: auth.user?.username || '',
    description: auth.user?.description || '',
    imageUrl: auth.user?.imageUrl || ''
  });

  useEffect(() => {
    // Actualizar el estado cuando cambia el usuario
    if (auth.user) {
      setFormData({
        username: auth.user.username || '',
        description: auth.user.description || '',
        imageUrl: auth.user.imageUrl || ''
      });
      setPreviewUrl(auth.user.imageUrl || null);
    }
  }, [auth.user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Crear URL temporal para vista previa inmediata
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);
      
      const formDataImage = new FormData();
      formDataImage.append('image', file);
      
      try {
        const response = await authService.uploadProfileImage(formDataImage);
        if (response.status === 'success' && response.data) {
          const { imageUrl } = response.data;
          setFormData(prev => ({
            ...prev,
            imageUrl
          }));
          
          // Actualizar el estado global
          updateUser(response.data);
          notify.success('Imagen de perfil actualizada correctamente');
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        notify.error(error.message || 'Error al subir la imagen');
        // Revertir la vista previa si hay error
        setPreviewUrl(formData.imageUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      notify.success('Perfil actualizado exitosamente');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  // Limpiar URLs temporales al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <ProfileContainer>
      <ProfileHeader>
        <h1>Mi Perfil</h1>
        {!isEditing && (
          <EditButton onClick={() => setIsEditing(true)}>
            Editar Perfil
          </EditButton>
        )}
      </ProfileHeader>

      <ProfileImageContainer>
        {previewUrl ? (
          <ProfileImage 
            src={previewUrl} 
            alt={auth.user?.username || 'Profile'} 
            onError={(e) => {
              console.error('Error loading image:', e);
              setPreviewUrl(null);
            }}
          />
        ) : (
          <DefaultProfileImage>
            {auth.user?.username?.charAt(0).toUpperCase() || 'U'}
          </DefaultProfileImage>
        )}
      </ProfileImageContainer>

      {isEditing ? (
        <EditForm onSubmit={handleSubmit}>
          <InfoItem>
            <label>Imagen de Perfil</label>
            <ImageUploadContainer>
              <ImageInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="profile-image-input"
              />
              <ImageUploadLabel htmlFor="profile-image-input">
                Seleccionar Imagen
              </ImageUploadLabel>
            </ImageUploadContainer>
          </InfoItem>
          <InfoItem>
            <label>Nombre de usuario</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InfoItem>
          <InfoItem>
            <label>Descripción</label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
            />
          </InfoItem>
          <ButtonContainer>
            <EditButton type="submit">Guardar Cambios</EditButton>
            <CancelButton 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setPreviewUrl(auth.user.imageUrl);
                setFormData({
                  username: auth.user.username || '',
                  description: auth.user.description || '',
                  imageUrl: auth.user.imageUrl || ''
                });
                if (selectedFile) {
                  setSelectedFile(null);
                }
              }}
            >
              Cancelar
            </CancelButton>
          </ButtonContainer>
        </EditForm>
      ) : (
        <ProfileInfo>
          <InfoItem>
            <InfoLabel>Nombre de usuario</InfoLabel>
            <InfoText>{auth.user?.username}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoText>{auth.user?.email}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Descripción</InfoLabel>
            <InfoText>{auth.user?.description || 'Sin descripción'}</InfoText>
          </InfoItem>
        </ProfileInfo>
      )}
    </ProfileContainer>
  );
}

export default Profile;