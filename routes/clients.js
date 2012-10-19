var client = require('../lib/client.js'),
    data = require('../lib/data.js'),
    release = require('../lib/release.js');

var clients = {};

clients.get = function(req, res) {
  res.render('clientversions', { title: 'Client Versions' });
};

clients.list = function(req, res) {
   data.getCollection('clients', function(e, collection) {
    if(e) {
      console.error(e);
      return res.send(500);
    }
    collection.find().toArray(function(e, clients) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      res.json(clients);
    });
  });
};

clients.update = function(req, res) {
  if(!req.body.name || !req.body.version) {
    console.error('missing fields');
    return res.send(500);
  }

  var client = {
    _id: req.body.name,
    name: req.body.name,
    version: req.body.version,
    date: Date.now() - 2000000
  };

  data.getCollection('clients', function(e, collection) {
    if(e) {
      console.error(e);
      return res.send(500);
    }
    collection.update({ _id: client.name }, client, { upsert: true }, function(e) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      res.send(200);
    });
  });
};

module.exports = clients;