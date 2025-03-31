const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateUser, isAdmin, userController.getAllUsers);
router.get('/me', authenticateUser, userController.getUserAuth);
router.put('/me', authenticateUser, userController.updateUserAuth);
router.delete('/me', authenticateUser, userController.deleteUserAuth);

module.exports = router;