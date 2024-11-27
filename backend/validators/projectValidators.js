const { check } = require('express-validator');
const { validateResults } = require('../middleware/validateResults');

const validateProject = [
  check('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  
  check('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
  
  check('endDate')
    .optional()
    .isISO8601().withMessage('Fecha inválida'),
  
  check('status')
    .isIn(['pendiente', 'en-progreso', 'completado'])
    .withMessage('Estado inválido'),
  
  check('priority')
    .isIn(['baja', 'media', 'alta'])
    .withMessage('Prioridad inválida'),
    
  validateResults
];

module.exports = {
  validateProject
}; 