import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import Tasks from '../pages/Tasks';
import PublicProjects from '../pages/PublicProjects';
import Profile from '../pages/Profile';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Todas las rutas públicas con Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/public-projects" element={<PublicProjects />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Ruta para manejar URLs no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 