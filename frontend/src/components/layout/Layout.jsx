import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  background: ${props => props.theme.colors.background};
  padding: 0;
  margin: 0;
`;

function Layout() {
  return (
    <LayoutContainer>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
}

export default Layout;