import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { auth } = useAuth();

  const hasPermission = (requiredPermission) => {
    if (!auth || !auth.role) return false;
    return auth.role.permissions.includes(requiredPermission);
  };

  const hasAnyPermission = (permissions) => {
    if (!auth || !auth.role) return false;
    return permissions.some(permission => 
      auth.role.permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissions) => {
    if (!auth || !auth.role) return false;
    return permissions.every(permission => 
      auth.role.permissions.includes(permission)
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}; 