var request = require('request');

var ria = {}

ria.login = function(username, password, urlLogin, urlGet) {
	request.post({
	        headers: {'content-type' : 'application/json'},
	        url: urlLogin,
	        body: JSON.stringify({
	         	"userName":username,
	         	"password":password,
	         	"isPersistent":"true",
	         	"customData":""
         	})
        }, function(error, response, body) {
        	request.get(urlGet, function(error, response, body) {
        		console.log(error);
        		console.log(response);
            	console.log(body);
        	});
    	});
};

module.exports = ria;