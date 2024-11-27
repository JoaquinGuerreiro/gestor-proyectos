import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../services/notificationService';
import CommentForm from './CommentForm';

const CommentContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Comment = styled.div`
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const CommentDate = styled.span`
  color: ${props => props.theme.colors.secondary};
  font-size: 0.875rem;
`;

function CommentList({ taskId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getTaskComments(taskId);
      setComments(data);
    } catch (error) {
      notify.error('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      await commentService.addComment(taskId, { content });
      loadComments();
    } catch (error) {
      notify.error('Error al agregar el comentario');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      loadComments();
    } catch (error) {
      notify.error('Error al eliminar el comentario');
    }
  };

  return (
    <CommentContainer>
      <h3>Comentarios</h3>
      <CommentForm onSubmit={handleAddComment} />
      
      {comments.map(comment => (
        <Comment key={comment._id}>
          <CommentHeader>
            <CommentAuthor>{comment.author.username}</CommentAuthor>
            <CommentDate>
              {new Date(comment.createdAt).toLocaleDateString()}
            </CommentDate>
          </CommentHeader>
          <p>{comment.content}</p>
          {auth?.id === comment.author._id && (
            <button 
              onClick={() => handleDeleteComment(comment._id)}
              className="text-red-500 text-sm mt-2"
            >
              Eliminar
            </button>
          )}
        </Comment>
      ))}
    </CommentContainer>
  );
}

export default CommentList; 