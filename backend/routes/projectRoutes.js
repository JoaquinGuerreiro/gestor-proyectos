const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
// Rutas públicas
router.get('/public', projectController.getPublicProjects);

// Middleware de autenticación para todas las rutas siguientes
router.use(auth);

// Ruta para subida de imágenes - Corregida
router.post('/upload', function(req, res, next) {
  upload.single('image')(req, res, function(err) {
    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    next();
  });
}, projectController.uploadImage);

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

router.post('/:projectId/invite', projectController.inviteUser);

router.get('/:id/creators', projectController.getProjectCreators);

router.delete('/:id/members/:userId', projectController.removeProjectMember);

// Verificar que esta ruta exista
router.get('/:id', projectController.getProject);

module.exports = router;