const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del proyecto es requerido'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  technologies: [{
    type: String,
    enum: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue', 'NodeJS', 'PHP', 'Python', 'Java', 'Ruby', 'TypeScript', 'MongoDB', 'MySQL', 'PostgreSQL'],
    required: true
  }],
  category: {
    type: String,
    enum: ['Desarrollo Frontend', 'Desarrollo Backend', 'Desarrollo Fullstack', 'Programación', 'Seguridad Informática', 'DevOps', 'Mobile Development', 'Data Science'],
    required: true
  },
  repositoryUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'La URL del repositorio debe ser válida'
    }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'completed', 'on_hold'],
    default: 'planning'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  creators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

// Añadimos un índice compuesto para optimizar las consultas
projectSchema.index({ creators: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema); 