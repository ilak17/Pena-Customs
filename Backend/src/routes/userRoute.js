const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/all-users', authenticateUser, isAdmin, userController.getAllUsers);
router.get('/me', authenticateUser, userController.getUserById);
router.put('/me/update', authenticateUser, userController.updateUser);
router.delete('/me/delete', authenticateUser, userController.deleteUser);

module.exports = router;