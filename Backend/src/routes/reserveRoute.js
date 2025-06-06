const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/my-reserves', authenticateUser, reserveController.getMyReserves);
router.get('/:sku', authenticateUser, reserveController.getReserveBySKU);
router.post('/', authenticateUser, reserveController.createReserve);
router.delete('/:sku', authenticateUser, isAdmin, reserveController.deleteReserve);

module.exports = router;