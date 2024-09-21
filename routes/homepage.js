const {
	getMessages,
	removeMessage,
} = require('../controllers/homepageController');

const router = require('express').Router();

router.get('/', getMessages);

router.post('/', removeMessage);

module.exports = router;
