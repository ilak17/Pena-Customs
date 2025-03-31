const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateUser, isAdmin, vehicleController.getAllVehicles);
router.get('/my-vehicles', authenticateUser, vehicleController.getAllMyVehicles);
router.get('/my-vehicles/:plate', authenticateUser, vehicleController.getMyVehicle);
router.post('/my-vehicles', authenticateUser, vehicleController.createVehicle);
router.put('/my-vehicles/:plate', authenticateUser, vehicleController.updateMyVehicle);
router.delete('/my-vehicles/:plate', authenticateUser, vehicleController.deleteVehicle);

module.exports = router;
