const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función auxiliar para obtener los datos del usuario sin campos sensibles
const getUserData = (user) => {
  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    description: user.description || '',
    imageUrl: user.imageUrl || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  console.log('Datos del usuario:', userData);
  return userData;
};

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/profiles';
    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png)'));
  }
}).single('image');

exports.uploadProfileImage = catchAsync(async (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'error',
        message: 'Error al subir la imagen: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, seleccione una imagen'
      });
    }

    try {
      const imageUrl = `/uploads/profiles/${req.file.filename}`;
      
      // Actualizar el usuario con la nueva imagen
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { imageUrl },
        { new: true }
      );

      res.status(200).json({
        status: 'success',
        data: getUserData(user)
      });
    } catch (error) {
      // Si hay un error, eliminar la imagen subida
      fs.unlink(req.file.path, () => {});
      throw error;
    }
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // 1) Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError('El email ya está registrado', 400));
  }

  // 2) Crear nuevo usuario
  const user = await User.create({
    username,
    email,
    password
  });

  // 3) Generar token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  // 4) Enviar respuesta
  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: getUserData(user)
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Verificar si email y password existen
    if (!email || !password) {
      return next(new CustomError('Por favor proporcione email y contraseña', 400));
    }

    // 2) Verificar si el usuario existe y la contraseña es correcta
    const user = await User.findOne({ email }).select('+password');
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');

    if (!user) {
      return next(new CustomError('Email o contraseña incorrectos', 401));
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      return next(new CustomError('Email o contraseña incorrectos', 401));
    }

    // 3) Generar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // 4) Enviar respuesta
    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: getUserData(user)
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    next(error);
  }
});

exports.verifyToken = catchAsync(async (req, res) => {
  // El usuario ya está verificado por el middleware auth
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new CustomError('Usuario no encontrado', 404);
  }

  res.status(200).json({
    status: 'success',
    data: getUserData(user)
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const { username, description } = req.body;
  
  // 1) Actualizar usuario
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username, description },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new CustomError('Usuario no encontrado', 404);
  }

  // 2) Enviar respuesta
  res.status(200).json({
    status: 'success',
    data: getUserData(user)
  });
});