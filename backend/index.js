const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');

const errorHandler = require('./utils/errorHandler');
const CustomError = require('./utils/CustomError');

// Rutas
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Crear y configurar la carpeta de uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar middleware para servir archivos estáticos
app.use('/uploads', express.static(uploadsDir));

// Middleware para debugging de archivos estáticos
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(uploadsDir, req.path);
  console.log('Request for static file:', {
    requestedPath: req.path,
    fullPath: filePath,
    exists: fs.existsSync(filePath)
  });
  next();
});

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
  next(new CustomError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Middleware de manejo de errores
app.use(errorHandler);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 