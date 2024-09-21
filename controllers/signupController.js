const { saveSignupFormToDatabase } = require('../database/queries');
const bcrypt = require('bcryptjs');

function getSignupForm(req, res) {
	res.render('signup', { error: null, message: null });
}

async function postSignupForm(req, res) {
	const { firstName, lastName, username, email, password, confirmPassword } =
		req.body;
	if (password !== confirmPassword) {
		return res.render('signup', {
			error: 'Passwords do not match',
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const defaultMembershipStatus = 'Not Member';

	try {
		await saveSignupFormToDatabase(
			firstName,
			lastName,
			username,
			email,
			hashedPassword,
			defaultMembershipStatus
		);
		req.session.message = 'Signup successful! You can now log in.';
		res.redirect('/login');
	} catch (error) {
		res.render('signup', {
			error:
				'An error occurred while processing your request. Please try again.',
			message: null,
		});
	}
}

module.exports = {
	getSignupForm,
	postSignupForm,
};
