const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateUser, isAdmin, reserveController.getAllReserves);
router.get('/:sku', reserveController.getReserveBySKU);
router.post('/', authenticateUser, reserveController.createReserve);
router.put('/:sku', authenticateUser, isAdmin, reserveController.updateReserve);
router.delete('/:sku', authenticateUser, reserveController.daleteReserve);

module.exports = router;