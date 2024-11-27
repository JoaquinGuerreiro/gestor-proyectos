import { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProjectHeader = styled.div`
  margin-bottom: 1rem;
`;

const CommentSection = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Comment = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
`;

const CommentMeta = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

function PublicProjectCard({ project }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { auth } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [project._id]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getProjectComments(project._id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.createComment(project._id, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <Card>
      <ProjectHeader>
        <h3>{project.name}</h3>
        <p>Por: {project.creator.username}</p>
        {project.description && <p>{project.description}</p>}
      </ProjectHeader>

      <CommentSection>
        <h4>Comentarios</h4>
        
        {auth.token && (
          <CommentForm onSubmit={handleSubmit}>
            <CommentInput
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
            />
            <button type="submit">Comentar</button>
          </CommentForm>
        )}

        <CommentList>
          {comments.map(comment => (
            <Comment key={comment._id}>
              <CommentMeta>
                <strong>{comment.author.username}</strong> · 
                {new Date(comment.createdAt).toLocaleDateString()}
              </CommentMeta>
              <p>{comment.content}</p>
            </Comment>
          ))}
        </CommentList>
      </CommentSection>
    </Card>
  );
}

export default PublicProjectCard; 