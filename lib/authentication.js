var authentication = {};

authentication.validate = function(username, password, done) {
	var valid = false;
	if(username === process.env['MEASURES_USER'] && password === process.env['MEASURES_PASSWORD']) {
		valid = true;
	}

	return done(null, valid);
}

module.exports = authentication;