const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    select: false
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxLength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    console.error('Error: Password not selected');
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Comparación de contraseñas:', {
      candidatePassword: candidatePassword ? '[PRESENTE]' : '[AUSENTE]',
      hashedPassword: this.password ? '[PRESENTE]' : '[AUSENTE]',
      isMatch
    });
    return isMatch;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};

// Hash de la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  try {
    // Solo hashear si la contraseña ha sido modificada
    if (!this.isModified('password')) return next();

    // Generar un salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);