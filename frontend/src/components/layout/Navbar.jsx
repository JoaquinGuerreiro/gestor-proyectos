import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const Nav = styled.nav`
  background: #2196f3;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: #E0FFFF;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  
  /* Opción 2: Fondo con borde suave */
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #E0FFFF;
  }
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: white;
    color: #2196f3;
  }
`;

const Navbar = () => {
  const { auth, logout } = useAuth();

  return (
    <Nav>
      <Logo to="/">Gestor de Proyectos</Logo>
      <NavLinks>
        {auth?.user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/tasks">Mis Tareas</NavLink>
            <NavLink to="/projects">Mis Proyectos</NavLink>
            <NavLink to="/public-projects">Proyectos Públicos</NavLink>
            <Button onClick={logout}>Cerrar Sesión</Button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar Sesión</NavLink>
            <NavLink to="/register">Registrarse</NavLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar; 