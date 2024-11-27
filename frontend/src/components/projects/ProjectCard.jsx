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
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  overflow: hidden;
  width: 100%;
`;

const ProjectContent = styled.div`
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProjectTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
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
  flex-shrink: 0;
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
  color: #666;
  font-size: 0.875rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: #999;
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

function ProjectCard({ project, onUpdate, showDeleteButton = true, showEditButton = true, showCreator = true }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const isCreator = String(auth?.user?._id) === String(project?.creator?._id);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      return;
    }

    try {
      setLoading(true);
      await projectService.deleteProject(project._id);
      notify.success('Proyecto eliminado exitosamente');
      onUpdate();
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

  return (
    <Card>
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
          {showCreator && (
            <CreatorInfo>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {project.creator?.username || 'Usuario desconocido'}
            </CreatorInfo>
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
          onProjectUpdated={() => {
            setIsEditModalOpen(false);
            onUpdate();
          }}
        />
      )}
    </Card>
  );
}

export default ProjectCard; 