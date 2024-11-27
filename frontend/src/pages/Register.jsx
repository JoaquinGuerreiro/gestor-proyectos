import styled from 'styled-components';
import RegisterForm from '../components/auth/RegisterForm';
import { PageContainer, ContentCard } from '../styles/shared';

const RegisterWrapper = styled(PageContainer)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RegisterContent = styled(ContentCard)`
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

function Register() {
  return (
    <RegisterWrapper>
      <RegisterContent>
        <Title>Crear Cuenta</Title>
        <RegisterForm />
      </RegisterContent>
    </RegisterWrapper>
  );
}

export default Register; 