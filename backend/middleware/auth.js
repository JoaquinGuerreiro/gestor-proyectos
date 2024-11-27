const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('=================================');
    console.log('Middleware de autenticación');
    console.log('Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No se proporcionó token');
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado - Token no proporcionado'
      });
    }

    console.log('Token recibido:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    const user = await User.findById(decoded.id);
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado - Usuario no encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en auth middleware:', error);
    return res.status(401).json({
      status: 'error',
      message: 'No autorizado'
    });
  }
};

module.exports = auth; 