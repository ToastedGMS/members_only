const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { findUserByEmail, findUserById } = require('../database/queries');

function initialize(passport) {
	const authenticateUser = async (email, password, done) => {
		try {
			const user = await findUserByEmail(email);

			if (!user) {
				return done(null, false, { message: 'No user with that email!' });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return done(null, false, { message: 'Incorrect Password' });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	};

	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await findUserById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
}

module.exports = initialize;
