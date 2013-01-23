var _ = require('underscore'),
    crypto = require('crypto'),
    data = require('../lib/data.js'),
    versions = require('./versions.js'),
    ria = require('../lib/ria.js');;

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

clients.getStatistics = function(req, res) {

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

      if(client.hostname) {        
        ria.get(client, "/Common-RIA-Web-Services-CoreDomainService.svc/JSON/GetActiveLicence", function(e, response, body) {
          if(e) {
            console.error(e);
            return res.send(500);
          }

          var licence = JSON.parse(body);

          var data = { 
            breached: licence.GetActiveLicenceResult.RootResults[0].Breached
          };

          console.log(data);

          return res.send(data);
        });
      } else {
        return res.send(null);
      }     
    });
  });
}

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

clients.viewUsage = function(req, res) {
  res.render('clientusage', { title: 'Client Usage' });
};

clients.getUsage = function(req, res) {
  var data = [
    {
      "x": "2012-11-05",
      "y": 1
    },
    {
      "x": "2012-11-06",
      "y": 6
    },
    {
      "x": "2012-11-07",
      "y": 13
    },
    {
      "x": "2012-11-08",
      "y": -3
    },
    {
      "x": "2012-11-09",
      "y": -4
    },
    {
      "x": "2012-11-10",
      "y": 9
    },
    {
      "x": "2012-11-11",
      "y": 77
    }
  ];

  res.send(data);
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
    var key = process.env.MEASURES_PASSWORD_KEY;
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var text = req.body.password;
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    

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