const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.post("/create", authenticateUser, isAdmin, adminController.createAdmin);

module.exports = router;