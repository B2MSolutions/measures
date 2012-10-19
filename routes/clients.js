var client = require('../lib/client.js'),
    release = require('../lib/release.js');

var clients = {};
clients.versions = {};

clients.versions.get = function(req, res) {
  res.render('clientversions', { title: 'Client Versions' });
};

module.exports = clients;