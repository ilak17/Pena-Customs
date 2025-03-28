const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');

router.get('/', reserveController.getAllReserves);
router.post('/:id', reserveController.createReserve);

module.exports = router;