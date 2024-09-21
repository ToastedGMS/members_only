const express = require('express');
const router = express.Router();
const {
	getDashboard,
	postSecretCode,
} = require('../controllers/dashboardController');

router.get('/', getDashboard);

router.post('/', postSecretCode);

module.exports = router;
