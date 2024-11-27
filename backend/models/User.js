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
  }
}, {
  timestamps: true
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Asegurarse de que this.password existe
    if (!this.password) {
      throw new Error('Password not selected');
    }
    
    console.log('Comparando contraseñas:');
    console.log('Contraseña proporcionada:', candidatePassword);
    console.log('Hash almacenado:', this.password);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('¿Coinciden?:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error en comparePassword:', error);
    return false;
  }
};

// Hash de la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 