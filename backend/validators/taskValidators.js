const { check } = require('express-validator');
const { validateResults } = require('../middleware/validateResults');

const validateTask = [
  check('title')
    .trim()
    .notEmpty().withMessage('El título es requerido')
    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),
  
  check('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
  
  check('status')
    .isIn(['pendiente', 'en-progreso', 'completada'])
    .withMessage('Estado inválido'),
  
  check('priority')
    .isIn(['baja', 'media', 'alta'])
    .withMessage('Prioridad inválida'),
  
  check('dueDate')
    .optional()
    .isISO8601().withMessage('Fecha inválida'),
    
  validateResults
];

module.exports = {
  validateTask
}; 