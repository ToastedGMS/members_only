const passport = require('passport');
const { findUserNameByEmail } = require('../database/queries');

function getLoginForm(req, res) {
	const message = req.session.message || null;
	delete req.session.message;
	const error = req.session.error || null;
	delete req.session.error;
	res.render('login', { message, error });
}

function postLoginForm(req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render('login', { error: info.message, message: null });
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			return res.redirect('/');
		});
	})(req, res, next);
}

module.exports = {
	getLoginForm,
	postLoginForm,
};
