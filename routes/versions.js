var _ = require('underscore'),
    data = require('../lib/data.js');

var versions = {};

versions.latest = function(req, res) {
  versions.all(function(e, vs) {
    if(e) {
      return res.send(500);
    }
    var latestVersion = _.max(vs, function(v){ return v.version; });
    res.json(latestVersion);
  });
};

versions.all = function(done) {
  data.getCollection('versions', function(e, collection) {
    if(e) {
      return done(e);
    }
    collection.find().sort( { version: -1 } ).toArray(done);
  });
};

versions.update = function(req, res) {
  if(!req.body.version || !req.body.date) {
    console.error('missing fields');
    return res.send(500);
  }

  var version = {
    _id: req.body.version,
    version: req.body.version,
    date: req.body.date
  };

  data.getCollection('versions', function(e, collection) {
    if(e) {
      console.error(e);
      return res.send(500);
    }
    collection.update({ _id: version.version }, version, { upsert: true }, function(e) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      res.send(200);
    });
  });
};

module.exports = versions;