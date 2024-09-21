const express = require('express');
const {
	getLoginForm,
	postLoginForm,
} = require('../controllers/loginController');
const router = express.Router();

router.get('/', getLoginForm);
router.post('/', postLoginForm);

module.exports = router;
