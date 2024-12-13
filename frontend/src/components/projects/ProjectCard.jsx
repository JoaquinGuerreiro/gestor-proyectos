import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { projectService } from '../../services/projectService';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../services/notificationService';
import EditProjectModal from './EditProjectModal';

// Base Button
const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.$danger ? '#ff4757' : '#f1f2f6'};
  color: ${props => props.$danger ? 'white' : '#2c3e50'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$danger ? '#ff6b81' : '#dfe4ea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ActionButton que extiende de Button
const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  overflow: hidden;
  width: calc(33.333% - 2rem);
  min-width: 400px;
  
  @media (max-width: 1400px) {
    width: calc(50% - 1.5rem);
  }
  
  @media (max-width: 900px) {
    width: 100%;
    min-width: unset;
  }
`;

const ProjectContent = styled.div`
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  word-break: break-word;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-height: 4.5em;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const ProjectBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.$isPublic ? '#e3f2fd' : '#f5f5f5'};
  color: ${props => props.$isPublic ? '#1976d2' : '#666'};
  border: 1px solid ${props => props.$isPublic ? '#bbdefb' : '#e0e0e0'};
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.text.muted};
  }
`;

const CommentsSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74,144,226,0.1);
  }
`;

const CommentList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Comment = styled.div`
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  
  .author {
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 0.25rem;
  }
  
  .content {
    color: #666;
  }
`;

const TechBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

function ProjectCard({ project, onProjectDeleted, onProjectUpdated, showDeleteButton = true, showEditButton = true, showCreator = true }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [imageError, setImageError] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';

  const isCreator = project.creators.some(creator => {
    const creatorId = creator._id || creator;
    return creatorId.toString() === auth.user._id.toString();
  });

  console.log('Project creators:', project.creators);
  console.log('Current user:', auth.user);
  console.log('Is creator:', isCreator);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      return;
    }

    try {
      setLoading(true);
      await projectService.deleteProject(project._id);
      notify.success('Proyecto eliminado exitosamente');
      if (onProjectDeleted) {
        onProjectDeleted(project._id);
      }
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      notify.error('Error al eliminar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await commentService.addComment(project._id, newComment);
      setNewComment('');
      fetchComments(); // Recargar comentarios
      notify.success('Comentario añadido exitosamente');
    } catch (error) {
      notify.error('Error al añadir el comentario');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await commentService.getComments(project._id);
      setComments(data);
    } catch (error) {
      notify.error('Error al cargar los comentarios');
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const renderComments = () => {
    if (loadingComments) {
      return <div>Cargando comentarios...</div>;
    }

    if (!comments || comments.length === 0) {
      return <div>No hay comentarios aún</div>;
    }

    return comments.map(comment => (
      <Comment key={comment._id}>
        <div className="author">
          {comment.creator?.username || 'Usuario desconocido'}
        </div>
        <div className="content">{comment.content}</div>
      </Comment>
    ));
  };

  const handleEditSuccess = (updatedProject) => {
    if (onProjectUpdated) {
      onProjectUpdated(updatedProject);
    }
    setIsEditModalOpen(false);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // Si la URL ya es absoluta, usarla directamente
    if (imageUrl.startsWith('http')) return imageUrl;
    // Si no, construir la URL completa
    return `${apiUrl}${imageUrl}`;
  };

  const handleImageError = (e) => {
    const fullUrl = getImageUrl(project.imageUrl);
    console.error('Error loading image:', {
      originalUrl: project.imageUrl,
      fullUrl: fullUrl,
      apiUrl: apiUrl
    });
    
    // Intentar verificar si la imagen existe
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });

    setImageError(true);
  };

  return (
    <Card>
      {project.imageUrl && !imageError ? (
        <ProjectImage 
          src={getImageUrl(project.imageUrl)}
          alt={project.name}
          onError={handleImageError}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <span>No image available</span>
        </div>
      )}
      
      <ProjectContent>
        <TitleRow>
          <ProjectTitle>{project.name}</ProjectTitle>
          {isCreator && (
            <Actions>
              {showEditButton && (
                <ActionButton onClick={() => setIsEditModalOpen(true)} disabled={loading}>
                  ✏️ Editar
                </ActionButton>
              )}
              {showDeleteButton && (
                <ActionButton onClick={handleDelete} disabled={loading} $danger>
                  🗑️ Eliminar
                </ActionButton>
              )}
            </Actions>
          )}
        </TitleRow>
        
        <ProjectDescription>{project.description}</ProjectDescription>
        
        <ProjectMeta>
          <ProjectBadge $isPublic={project.isPublic}>
            {project.isPublic ? '🌎 Proyecto Público' : '🔒 Proyecto Privado'}
          </ProjectBadge>
          {showCreator && project.creator && (
            <CreatorInfo>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {project.creator.username || 'Usuario desconocido'}
            </CreatorInfo>
          )}
        </ProjectMeta>

        <ProjectMeta>
          <div>
            <strong>Categoría:</strong> {project.category}
          </div>
          
          <div>
            <strong>Tecnologías:</strong>
            <div>
              {project.technologies.map(tech => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </div>
          </div>
          
          {project.repositoryUrl && (
            <ProjectLinks>
              <ProjectLink href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                Ver Repositorio
              </ProjectLink>
            </ProjectLinks>
          )}
        </ProjectMeta>

        <CommentsSection>
          <Button onClick={() => setShowComments(!showComments)}>
            {showComments ? '🔼 Ocultar comentarios' : '🔽 Ver comentarios'}
          </Button>

          {showComments && (
            <>
              <CommentForm onSubmit={handleAddComment}>
                <CommentInput
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !newComment.trim()}>
                  {loading ? 'Enviando...' : 'Comentar'}
                </Button>
              </CommentForm>

              <CommentList>
                {renderComments()}
              </CommentList>
            </>
          )}
        </CommentsSection>
      </ProjectContent>

      {isEditModalOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setIsEditModalOpen(false)}
          onProjectUpdated={handleEditSuccess}
        />
      )}
    </Card>
  );
}

export default ProjectCard;