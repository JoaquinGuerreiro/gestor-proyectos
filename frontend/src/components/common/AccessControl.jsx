import { usePermissions } from '../../hooks/usePermissions';

const AccessControl = ({ 
  permissions, 
  requireAll = false, 
  fallback = null, 
  children 
}) => {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default AccessControl; 