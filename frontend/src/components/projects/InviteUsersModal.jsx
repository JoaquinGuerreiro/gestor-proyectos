import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { projectService } from '../../services/projectService';
import { notify } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  max-height: 80vh;
  overflow-y: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

const InviteButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => 
    props.$isInvited 
      ? '#48BB78' // verde para usuarios ya invitados
      : props.disabled 
        ? '#E2E8F0' // gris para botón deshabilitado
        : '#3182CE' // azul para botón normal
  };
  color: white;
  cursor: ${props => props.$isInvited || props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => (props.disabled || props.$isInvited) ? 0.7 : 1};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => 
      props.$isInvited 
        ? '#48BB78'
        : props.disabled 
          ? '#E2E8F0'
          : '#2B6CB0'
    };
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  small {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

function InviteUsersModal({ projectId, onClose, onProjectUpdated }) {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [projectCreators, setProjectCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [invitingUsers, setInvitingUsers] = useState(new Set());
  const [isOriginalCreator, setIsOriginalCreator] = useState(false);

  useEffect(() => {
    const currentUserId = auth?.user?._id || auth?.user?.id;
    if (currentUserId) {
      loadData();
    }
  }, [projectId, auth?.user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, projectData] = await Promise.all([
        userService.getAllUsers(),
        projectService.getProjectCreators(projectId)
      ]);
      
      setUsers(usersData);
      setProjectCreators(projectData || []);
      
      // Verificar si el usuario actual es el creador original
      const currentUserId = auth?.user?._id || auth?.user?.id;
      const isCreator = projectData && 
                       projectData.length > 0 && 
                       projectData[0]._id === currentUserId;
      
      setIsOriginalCreator(isCreator);
      
      console.log('Creadores:', projectData);
      console.log('Auth completo:', auth);
      console.log('Usuario actual objeto:', auth?.user);
      console.log('ID del usuario actual:', currentUserId);
      console.log('ID del primer creador:', projectData?.[0]?._id);
      console.log('Es creador original:', isCreator);
    } catch (error) {
      console.error('Error cargando datos:', error);
      notify.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (userId) => {
    try {
      setInvitingUsers(prev => new Set(prev).add(userId));
      await projectService.inviteUser(projectId, userId);
      await loadData(); // Recargar los datos
      notify.success('Usuario invitado exitosamente');
    } catch (error) {
      notify.error('Error al invitar al usuario');
    } finally {
      setInvitingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await projectService.removeMember(projectId, userId);
      await loadData(); // Recargar los datos
      notify.success('Miembro eliminado exitosamente');
    } catch (error) {
      notify.error('Error al eliminar al miembro');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Gestionar Miembros del Proyecto</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <SearchInput
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <UserList>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            filteredUsers.map(user => {
              const isInvited = projectCreators.some(creator => 
                creator._id === user._id || creator === user._id
              );
              // Verificar si el usuario es el creador original
              const isCreatorOriginal = projectCreators.length > 0 && 
                                      (projectCreators[0]._id === user._id || 
                                       projectCreators[0] === user._id);

              return (
                <UserItem key={user._id}>
                  <UserInfo>
                    <span>{user.username}</span>
                    <small>{user.email}</small>
                    {isCreatorOriginal && <small>(Creador Original)</small>}
                  </UserInfo>
                  
                  {isInvited ? (
                    <>
                      <InviteButton disabled>
                        Ya es miembro
                      </InviteButton>
                      {isOriginalCreator && !isCreatorOriginal && (
                        <DeleteButton
                          onClick={() => handleRemoveMember(user._id)}
                        >
                          Eliminar
                        </DeleteButton>
                      )}
                    </>
                  ) : (
                    <InviteButton
                      onClick={() => handleInviteUser(user._id)}
                      disabled={invitingUsers.has(user._id)}
                    >
                      {invitingUsers.has(user._id) ? 'Invitando...' : 'Invitar'}
                    </InviteButton>
                  )}
                </UserItem>
              );
            })
          )}
        </UserList>
      </ModalContent>
    </ModalOverlay>
  );
}

export default InviteUsersModal; 