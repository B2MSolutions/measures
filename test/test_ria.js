var ria = require('../lib/ria.js');

var user = process.argv[2];
console.log(user);
var password = process.argv[3];
console.log(password);
var url = process.argv[4];
console.log(url);
var urlGet = process.argv[5];
console.log(urlGet);

ria.login(user, password, url, urlGet);