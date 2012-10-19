var _ = require('underscore'),
    client = require('../lib/client.js'),
    data = require('../lib/data.js'),
    release = require('../lib/release.js');

var versions = {};

versions.latest = function(req, res) {
  data.getCollection('versions', function(e, collection) {
    if(e) {
      return res.send(500);
    }
    collection.find().toArray(function(e, vs) {
      var latestVersion = _.max(vs, function(v){ return v.version; });
      res.json(latestVersion);
    });
  });
};

module.exports = versions;