const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Crear directorios de uploads si no existen
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
const publicDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir);
}
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Middleware de logging para todas las peticiones
app.use((req, res, next) => {
  console.log('\n=================================');
  console.log('INCOMING REQUEST');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Original URL: ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  console.log('=================================\n');
  next();
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

console.log('Montando rutas en app.js...');
// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
console.log('Rutas montadas exitosamente');

// Imprimir todas las rutas registradas
console.log('\nRutas disponibles:');
app._router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  } else if (r.name === 'router') {
    console.log(`Router montado en: ${r.regexp}`);
  }
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  console.log('\n=================================');
  console.log('RUTA NO ENCONTRADA');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Original URL: ${req.originalUrl}`);
  console.log('Rutas disponibles:', 
    app._router.stack
      .filter(r => r.route || r.name === 'router')
      .map(r => r.route ? r.route.path : r.regexp)
  );
  console.log('=================================\n');
  
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    mensaje: 'Algo salió mal en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Ruta absoluta al directorio de uploads
console.log('Static files directory:', publicDir);

// Configurar el middleware para servir archivos estáticos
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Servir archivos estáticos con opciones
app.use('/uploads', express.static(publicDir, {
  setHeaders: (res, path, stat) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Middleware para debugging de acceso a archivos
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(publicDir, req.url);
  console.log('Request for file:', req.url);
  console.log('Looking for file at:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: 'error',
      message: `File not found: ${req.url}`
    });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; 