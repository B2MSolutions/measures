var _ = require('underscore'),
    data = require('../lib/data.js'),
    versions = require('./versions.js');

var clients = {};

clients.get = function(req, res) {
  res.render('clientversions', { title: 'Client Versions' });
};

clients.getOne = function(req, res) {
  data.getCollection('clients', function(e, collection) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    collection.findOne({_id: req.params.name}, function(e, client) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      versions.all(function(e, vs) {
        return res.render('client', { title: req.params.name, client: client, versions: vs });
      });
    });
  });
};

clients.list = function(req, res) {
  versions.all(function(e, vs) {
    if(e) {
      console.error(e);
      return res.send(500);
    }
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

        _.each(clients, function(client) {
          var version = _.find(vs, function(v) { return v.version == client.version; });
          if(!version) {
            version = { date: new Date(2000, 1, 1).getTime() };
          }

          client.date = version.date;
        });

        res.json(clients);
      });
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