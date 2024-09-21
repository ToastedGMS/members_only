// Importing required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./config/passport-config');

// Load environment variables from .env file
dotenv.config();

// Helper functions
async function isMember(req, res, next) {
	// Check if the user is authenticated
	if (!req.user) {
		res.locals.isUserMember = false;
		return next();
	}
	// If the user is authenticated, check membership status
	try {
		res.locals.isUserMember = await checkMembershipStatus(req.user);
	} catch (error) {
		console.error('Error fetching membership status', error);
		res.locals.isUserMember = false;
	}
	next();
}

async function isAdmin(req, res, next) {
	// Check if the user is authenticated
	if (!req.user) {
		res.locals.isUserAdmin = false;
		return next();
	}
	// If the user is authenticated, check membership status
	try {
		res.locals.isUserAdmin = await checkAdminStatus(req.user);
	} catch (error) {
		console.error('Error fetching membership status', error);
		res.locals.isUserAdmin = false;
	}
	next();
}

// Middleware
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json()); // For parsing JSON data
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'your_secret_key',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	})
);
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(isMember);
app.use(isAdmin);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const signupRoute = require('./routes/signup.js');
app.use('/signup', signupRoute);
const loginRoute = require('./routes/login.js');
app.use('/login', loginRoute);
const dashboardRoute = require('./routes/dashboard.js');
app.use('/dashboard', dashboardRoute);
const logoutRoute = require('./routes/logout.js');
app.use('/logout', logoutRoute);
const homeRoute = require('./routes/homepage.js');
app.use('/', homeRoute);
const newMessageRoute = require('./routes/newMessage.js');
const {
	checkMembershipStatus,
	checkAdminStatus,
} = require('./database/queries.js');
app.use('/newmessage', newMessageRoute);

// Static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
