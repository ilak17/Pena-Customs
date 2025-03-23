const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', vehicleController.createVehicle);
router.delete('/delete-vehicle/:id', vehicleController.deleteVehicle);
router.put('/update/:id', vehicleController.updateVehicle);

module.exports = router;
