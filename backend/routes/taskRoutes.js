const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

console.log('Inicializando rutas de tareas...');

// Middleware de autenticación para todas las rutas
router.use(auth);

// Rutas de tareas
router.route('/')
  .get(taskController.getTasks)
  .post(taskController.createTask);

router.route('/:id')
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

// Log de rutas registradas
console.log('Rutas de tareas configuradas:', 
  router.stack
    .filter(r => r.route)
    .map(r => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    }))
);

module.exports = router;
// Middleware de logging para rutas de tareas
router.use((req, res, next) => {
  console.log('=================================');
  console.log('TASK ROUTES MIDDLEWARE');
  console.log(`Método: ${req.method}`);
  console.log(`Ruta completa: ${req.originalUrl}`);
  console.log(`Ruta base: ${req.baseUrl}`);
  console.log(`Ruta path: ${req.path}`);
  console.log('=================================');
  next();
});

// Proteger todas las rutas
router.use(auth);

// Rutas de tareas
router.get('/', (req, res, next) => {
  console.log('Entrando a GET / en taskRoutes');
  next();
}, taskController.getTasks);

// Imprimir todas las rutas registradas al cargar el módulo
const routes = router.stack.map(r => {
  if (r.route) {
    return {
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    };
  }
  return null;
}).filter(Boolean);

console.log('Rutas de tareas configuradas:', routes);

module.exports = router;