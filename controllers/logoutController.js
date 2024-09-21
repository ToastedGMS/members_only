function handleLogout(req, res) {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
}

module.exports = handleLogout;
