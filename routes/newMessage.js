const {
	getNewMessageForm,
	postMessage,
} = require('../controllers/newMessageController');

const router = require('express').Router();

router.get('/', getNewMessageForm);

router.post('/', postMessage);

module.exports = router;
