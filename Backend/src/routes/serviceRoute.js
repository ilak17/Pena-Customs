const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', serviceController.getAllServices);
router.get('/:sku', serviceController.getServiceBySku);
router.post('/', authenticateUser, isAdmin, serviceController.createService);
router.put('/:id', authenticateUser, isAdmin, serviceController.updateService);
router.delete('/:id', authenticateUser, isAdmin, serviceController.deleteService);

module.exports = router;