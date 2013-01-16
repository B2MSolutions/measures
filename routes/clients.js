var _ = require('underscore'),
    crypto = require('crypto'),
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
          var version = _.find(vs, function(v) { 
            return v.version == client.version; 
          });     

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
    name: req.body.name,
    version: req.body.version,
    hostname: req.body.hostname,
    username: req.body.username
  };

  if(req.body.password) {
    var key = process.env.MEASURES_PASSWORD_KEY,
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var text = req.body.password;
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // var decipher = crypto.createDecipher('aes-256-cbc', key);
    // var dec = decipher.update(encrypted, 'hex', 'utf8');
    // dec += decipher.final('utf8');
    // console.log(dec);

    client.password = encrypted;
  }

  data.getCollection('clients', function(e, collection) {
    if(e) {
      console.error(e);
      return res.send(500);
    }
    collection.update({ _id: client.name }, { "$set" : client }, { upsert: true }, function(e) {
      if(e) {
        console.error(e);
        return res.send(500);
      }
      res.send(200);
    });
  });
};

module.exports = clients;