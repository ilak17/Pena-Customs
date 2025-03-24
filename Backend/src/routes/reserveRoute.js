const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');

router.post('/:id', reserveController.createReserve);

module.exports = router;