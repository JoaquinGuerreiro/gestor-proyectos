import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../styles/shared';

const HomeWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: ${props => props.theme.colors.background};
`;

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    font-size: 1.25rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  min-width: 150px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

function Home() {
  return (
    <HomeWrapper>
      <HomeContainer>
        <HeroSection>
          <Title>Bienvenido a Gestor de Proyectos</Title>
          <Subtitle>
            Una plataforma intuitiva para gestionar tus proyectos y tareas de manera eficiente.
            Organiza, colabora y alcanza tus objetivos.
          </Subtitle>
        </HeroSection>

        <FeaturesGrid>
          <FeatureCard>
            <h3>🎯 Gestión de Proyectos</h3>
            <p>
              Organiza y administra tus proyectos de forma eficiente con nuestras 
              herramientas intuitivas y fáciles de usar.
            </p>
          </FeatureCard>
          <FeatureCard>
            <h3>✓ Seguimiento de Tareas</h3>
            <p>
              Mantén un registro detallado de todas tus tareas y su progreso. 
              Nunca pierdas de vista tus objetivos.
            </p>
          </FeatureCard>
          <FeatureCard>
            <h3>👥 Proyectos Públicos</h3>
            <p>
              Trabaja en conjunto con tu equipo, comparte proyectos y mantén 
              todo sincronizado en tiempo real.
            </p>
          </FeatureCard>
        </FeaturesGrid>

        <ButtonGroup>
          <StyledLink to="/login">
            <StyledButton>Iniciar Sesión</StyledButton>
          </StyledLink>
          <StyledLink to="/register">
            <StyledButton $variant="secondary">Registrarse</StyledButton>
          </StyledLink>
        </ButtonGroup>
      </HomeContainer>
    </HomeWrapper>
  );
}

export default Home; 