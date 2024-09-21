const {
	saveMessagetoDatabase,
	findUserByEmail,
} = require('../database/queries');

function getNewMessageForm(req, res) {
	if (!req.isAuthenticated()) {
		req.session.error = 'You need to login.';
		return res.redirect('login');
	}
	res.render('newMessage');
}

async function postMessage(req, res) {
	const message = req.body.message;
	const title = req.body.title || '';
	const user = await findUserByEmail(req.user.email);

	try {
		await saveMessagetoDatabase(title, message, user);
		res.redirect('/');
	} catch (error) {
		console.error('Error posting message', error);
		throw error;
	}
}

module.exports = {
	getNewMessageForm,
	postMessage,
};
