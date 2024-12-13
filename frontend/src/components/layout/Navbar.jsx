import { useState, useRef, useEffect } from 'react';
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

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 0.5rem 0;
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  color: #333;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: block;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DropdownLogoutButton = styled.button`
  color: #333;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Navbar = () => {
  const { auth, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <UserDropdown ref={dropdownRef}>
              <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {auth.user.username}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </DropdownButton>
              <DropdownContent $isOpen={isDropdownOpen}>
                <DropdownItem to="/profile">Mi Perfil</DropdownItem>
                <DropdownLogoutButton onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}>
                  Cerrar Sesión
                </DropdownLogoutButton>
              </DropdownContent>
            </UserDropdown>
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