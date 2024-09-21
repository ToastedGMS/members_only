const express = require('express');
const router = express.Router();
const {
	getSignupForm,
	postSignupForm,
} = require('../controllers/signupController');

router.get('/', getSignupForm);
router.post('/', postSignupForm);

module.exports = router;
