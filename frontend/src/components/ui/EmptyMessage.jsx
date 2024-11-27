import styled from 'styled-components';

const EmptyMessageWrapper = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  background: ${props => props.theme.colors.background.light};
  border-radius: 8px;
  border: 1px dashed ${props => props.theme.colors.border};
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const EmptyMessage = ({ children, icon = '📝' }) => {
  return (
    <EmptyMessageWrapper>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyText>{children}</EmptyText>
    </EmptyMessageWrapper>
  );
};

export default EmptyMessage; 