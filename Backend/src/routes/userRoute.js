const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');
const user = require('../models/user');

router.get('/', authenticateUser, isAdmin, userController.getAllUsers);
router.get('/me', authenticateUser, userController.getUserAuth);
router.post('/reset-password', userController.requestPasswordReset);
router.put('/me', authenticateUser, userController.updateUserAuth);
router.delete('/me', authenticateUser, userController.deleteUserAuth);

module.exports = router;