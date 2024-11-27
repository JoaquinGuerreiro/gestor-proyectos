import styled from 'styled-components';
import LoginForm from '../components/auth/LoginForm';
import { PageContainer, ContentCard } from '../styles/shared';

const LoginWrapper = styled(PageContainer)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoginContent = styled(ContentCard)`
  max-width: 450px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
`;

function Login() {
  return (
    <LoginWrapper>
      <LoginContent>
        <Title>Iniciar Sesión</Title>
        <LoginForm />
      </LoginContent>
    </LoginWrapper>
  );
}

export default Login; 