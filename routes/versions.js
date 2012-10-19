var client = require('../lib/client.js'),
    release = require('../lib/release.js');

var versions = {};

versions.latest = function(req, res) {
  var data = {
    version: 123,
    date: Date.now() - 120000
  };

  res.json(data);
};

module.exports = versions;