import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { auth } = useAuth();

  // Si no hay usuario autenticado, redirige al login
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario autenticado, renderiza el contenido
  return <Outlet />;
};

export default PrivateRoute; 