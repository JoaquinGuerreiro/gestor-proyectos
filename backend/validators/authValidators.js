const Joi = require('joi');

exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.empty': 'El nombre de usuario es obligatorio',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
        'string.max': 'El nombre de usuario no puede tener más de 30 caracteres'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'El email es obligatorio',
        'string.email': 'El email no es válido'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': 'La contraseña es obligatoria',
        'string.min': 'La contraseña debe tener al menos 6 caracteres'
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