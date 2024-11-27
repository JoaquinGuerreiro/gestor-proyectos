const Joi = require('joi');

exports.validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede tener más de 50 caracteres'
      }),
    description: Joi.string()
      .max(200)
      .allow('')
      .messages({
        'string.max': 'La descripción no puede tener más de 200 caracteres'
      }),
    color: Joi.string()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .allow('')
      .messages({
        'string.pattern.base': 'El color debe ser un código hexadecimal válido'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      mensaje: error.details[0].message
    });
  }
  next();
}; 