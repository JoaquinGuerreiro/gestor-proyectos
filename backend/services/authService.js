const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');

class AuthService {
  async register(userData) {
    const { email, password, username } = userData;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('El email ya está registrado');
      }
      if (existingUser.username === username) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      throw new Error('El usuario ya existe');
    }

    const user = new User(userData);
    await user.save();

    return user;
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('El email no está registrado');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('La contraseña es incorrecta');
    }

    const token = generateToken(user._id);

    return { user, token };
  }

  async getProfile(userId) {
    return await User.findById(userId).select('-password');
  }
}

module.exports = AuthService; 