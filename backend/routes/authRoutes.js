const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/profile', auth, authController.updateProfile);
router.post('/profile/image', auth, authController.uploadProfileImage);
router.get('/verify', auth, authController.verifyToken);

module.exports = router;