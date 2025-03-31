const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/all-vehicles', authenticateUser, isAdmin, vehicleController.getAllVehicles);
router.get('/my-vehicles', authenticateUser, vehicleController.getAllMyVehicles);
router.get('/my-vehicles/vehicle/:id', authenticateUser, vehicleController.getVehicleById);
router.post('/my-vehicles/new-vehicle', authenticateUser, vehicleController.createVehicle);
router.delete('/my-vehicles/vehicle/delete/:id', authenticateUser, vehicleController.deleteVehicle);
router.put('/my-vehicle/vehicle/update', authenticateUser, vehicleController.updateVehicle);

module.exports = router;
