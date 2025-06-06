const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/statistics', authenticateUser, isAdmin, adminController.getDbStatus);
router.post("/create", authenticateUser, isAdmin, adminController.createAdmin);
router.put("/verify-user/:id", authenticateUser, isAdmin, adminController.verifyUser);
router.delete("/delete-user/:id", authenticateUser, isAdmin, adminController.deleteUser);
router.get('/reserves', authenticateUser, isAdmin, adminController.getAllReserves);
router.put('/update-reserve/:sku', authenticateUser, isAdmin, adminController.updateReserve);
module.exports = router;