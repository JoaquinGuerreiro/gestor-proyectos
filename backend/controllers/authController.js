const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // 1) Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError('El email ya está registrado', 400));
  }

  // 2) Crear nuevo usuario - NO hashear la contraseña aquí
  const user = await User.create({
    username,
    email,
    password // La contraseña se hasheará en el middleware pre-save
  });

  // 3) Generar token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  // 4) Remover la contraseña de la salida
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  console.log('1. Intento de login:', { email });

  // 1) Verificar que email y password estén presentes
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Por favor, proporcione email y contraseña'
    });
  }

  // 2) Buscar usuario y SELECCIONAR EXPLÍCITAMENTE el password
  const user = await User.findOne({ email }).select('+password');
  console.log('2. Usuario encontrado:', user ? 'Sí' : 'No');

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Email o contraseña incorrectos'
    });
  }

  // 3) Verificar contraseña
  const isPasswordValid = await user.comparePassword(password);
  console.log('3. Contraseña válida:', isPasswordValid);

  if (!isPasswordValid) {
    return res.status(401).json({
      status: 'error',
      message: 'Email o contraseña incorrectos'
    });
  }

  // 4) Generar token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 5) Enviar respuesta
  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }
  });
}); 