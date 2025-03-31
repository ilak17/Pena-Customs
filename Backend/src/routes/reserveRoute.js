const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');

router.get('/', reserveController.getAllReserves);
router.get('/:id', reserveController.getReserveById);
router.post('/:id', reserveController.createReserve);
router.put('/update/:id', reserveController.updateReserve);
router.delete('/delete/:id', reserveController.daleteReserve);

module.exports = router;