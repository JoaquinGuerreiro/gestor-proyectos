const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/public', projectController.getPublicProjects);

// Middleware de autenticación para todas las rutas siguientes
router.use(auth);

// Rutas protegidas
router.route('/')
  .get(projectController.getProjects)
  .post(projectController.createProject);

router.route('/:id')
  .get(projectController.getProject)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// Rutas de comentarios
router.route('/:projectId/comments')
  .get(projectController.getComments)
  .post(projectController.addComment);

router.route('/:projectId/comments/:commentId')
  .delete(projectController.deleteComment);

module.exports = router;