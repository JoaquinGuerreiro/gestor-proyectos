import styled from 'styled-components';

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, #f8f9fa, #fff);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin: 2rem;

  h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #6c757d;
    margin-bottom: 2rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <EmptyStateContainer>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </EmptyStateContainer>
  );
}

export default EmptyState; 