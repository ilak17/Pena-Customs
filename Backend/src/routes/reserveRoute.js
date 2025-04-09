const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateUser, isAdmin, reserveController.getAllReserves);
router.get('/:sku', reserveController.getReserveBySKU);
router.get('/my-reserves', authenticateUser, reserveController.getMyReserves);
router.post('/', authenticateUser, reserveController.createReserve);
router.put('/:sku', authenticateUser, isAdmin, reserveController.updateReserve);
router.delete('/:sku', authenticateUser, reserveController.deleteReserve);

module.exports = router;