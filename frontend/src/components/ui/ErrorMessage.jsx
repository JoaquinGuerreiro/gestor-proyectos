import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: ${props => props.theme.colors.danger}20;
  border: 1px solid ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.danger};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin: ${props => props.theme.spacing.md} 0;
  text-align: center;
`;

const ErrorMessage = ({ message }) => (
  <ErrorContainer>
    <p>{message || 'Ha ocurrido un error'}</p>
  </ErrorContainer>
);

export default ErrorMessage; 