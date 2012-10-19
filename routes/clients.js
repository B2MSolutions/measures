var client = require('../lib/client.js'),
    release = require('../lib/release.js');

var clients = {};

clients.get = function(req, res) {
  res.render('clientversions', { title: 'Client Versions' });
};

clients.list = function(req, res) {
  var data = [
    { name: 'Client 1', version: '12', date: Date.now() - 120000 },
    { name: 'Client 2', version: '2', date: Date.now() - 2111120000 },
    { name: 'Client 3', version: '1', date: Date.now() - 222222120000 }
  ];

  res.json(data);
};

module.exports = clients;