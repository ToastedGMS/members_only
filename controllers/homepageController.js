const { fetchMessages, deleteMessage } = require('../database/queries');

async function getMessages(req, res) {
	const messages = await fetchMessages();
	res.render('homepage', { messages });
}

async function removeMessage(req, res) {
	await deleteMessage(req.body.messageId);
	const messages = await fetchMessages();
	res.render('homepage', { messages });
}

module.exports = { getMessages, removeMessage };
