var crypto = require('crypto');
	request = require('request');

var ria = {}

ria.get = function(config, urlGet, done) {

	var rootUrl = "https://" + config.hostname + "/mprodigy/console/Services";
	var loginUrl = rootUrl + "/Common-RIA-Web-Services-AuthenticationDomainService.svc/JSON/Login";
	console.log(loginUrl);

	var decipher = crypto.createDecipher('aes-256-cbc', process.env.MEASURES_PASSWORD_KEY);
    var decryptedPassword = decipher.update(config.password, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');

	request.post({
			strictSSL: false,
	        headers: {'content-type' : 'application/json'},
	        url: loginUrl,
	        body: JSON.stringify({
	         	"userName":config.username,
	         	"password":decryptedPassword,
	         	"isPersistent":"true",
	         	"customData":""
         	})
        }, function(error, response, body) {
        	if(error) {
        		return done(error);
        	}
        	console.log('logged in ok');
        	var getUrl = rootUrl + urlGet;
        	request.get(getUrl, done);
    	});
};

module.exports = ria;