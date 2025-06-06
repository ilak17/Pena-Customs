const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');
 
router.get('/verify/:verifyToken', authController.emailVerify);
router.put('/reset/:resetToken', authController.resetPassword);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authenticateUser, authController.logOut);

module.exports = router;