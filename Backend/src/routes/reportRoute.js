const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateUser, isAdmin, reportController.getServiceReportPDF);

module.exports = router;
