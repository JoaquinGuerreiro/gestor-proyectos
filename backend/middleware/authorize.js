const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          mensaje: 'No tienes permisos suficientes'
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al verificar permisos'
      });
    }
  };
};

module.exports = authorize; 