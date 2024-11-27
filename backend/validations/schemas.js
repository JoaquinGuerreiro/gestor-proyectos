const Joi = require('joi');

const schemas = {
  registro: Joi.object({
    username: Joi.string()
      .required()
      .messages({
        'string.empty': 'El nombre de usuario es requerido'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'El email es requerido',
        'string.email': 'Debe ser un email válido'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': 'La contraseña es requerida',
        'string.min': 'La contraseña debe tener al menos 6 caracteres'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
  })
};

module.exports = { schemas }; 