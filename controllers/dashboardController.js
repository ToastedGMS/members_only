const {
	findUserByEmail,
	changeMembershipStatus,
} = require('../database/queries');

function getDashboard(req, res) {
	if (!req.isAuthenticated()) {
		req.session.error = 'You need to login.';
		return res.redirect('login');
	}
	res.render('dashboard', {
		name: req.user.username,
		message: null,
		error: null,
	});
}

async function postSecretCode(req, res) {
	const code = req.body.code;

	try {
		if (code === process.env.SECRET_CODE) {
			const user = await findUserByEmail(req.user.email);
			await changeMembershipStatus(user);

			return res.render('dashboard', {
				name: req.user.first_name,
				message: 'You are now a member. Welcome to the club!',
				error: null,
			});
		} else {
			return res.render('dashboard', {
				name: req.user.first_name,
				message: null,
				error: 'Code is not valid.',
			});
		}
	} catch (error) {
		console.error('Error executing query', error);
		throw error;
	}
}

module.exports = { getDashboard, postSecretCode };
