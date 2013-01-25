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
  clients.getClient(req.params.name, function(e, client) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    versions.all(function(e, vs) {
      return res.render('client', { title: req.params.name, client: client, versions: vs });
    });
  });
};

clients.getStatistics = function(req, res) {
  clients.getClient(req.params.name, function(e, client) {
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
  res.render('clientusage', { title: 'Client Usage', client: req.params.name });
};

var getDate = function(dt) {  
  //'2013-01-25T11:00:00.000Z'
  return new Date(parseInt(dt.substr(6, 13)));//.toJSON().substr(0, 19);
 }


clients.getUsage = function(req, res) {
  clients.getClient(req.params.name, function(e, client) {
    if(e) {
      console.error(e);
      return res.send(500);
    }

    if(!client) {
      console.error('could not find ' + req.params.name);
      return res.send(500);
    }

    if(client.hostname) {        
      ria.get(client, "/Common-RIA-Web-Services-CoreDomainService.svc/JSON/GetHourlyClientUsage", function(e, response, body) {
        if(e) {
          console.error(e);
          return res.send(500);
        }

        var results = JSON.parse(body);

        var mappedFromWCF = _.map(results.GetHourlyClientUsageResult.RootResults, function(result){ return { x: getDate(result.Slice), y: result.Count } });
        var sortedByDate = _.sortBy(mappedFromWCF, function(result) { return result.x; });
        var addGapsBetweenHours = clients.interpolate(sortedByDate, new Date());
        var mappedForXCharts = _.map(addGapsBetweenHours, function(result) { return { x: result.x.toJSON().substr(0, 19), y: result.y };});

        console.log(mappedForXCharts);
        res.send(mappedForXCharts);    
      });
    }
  });
};
clients.interpolate = function(initial, endDate) {

  var msInOneHour = (1000 * 60 * 60);

  var last = _.last(initial);

  if(last && clients.diffInHours(last.x, endDate) > 0) {
    initial.push({ x: endDate, y: 0});
  };


  var result = [];

  for (var i = 0; i < initial.length; ++i) {
    result.push(initial[i]);

    if(i < initial.length - 1) {
      var thisDate = initial[i].x;
      var nextDate = initial[i+1].x;

      var diffinHours = clients.diffInHours(thisDate, nextDate);
      while(diffinHours > 0) {
        result.push({ x: new Date(nextDate - diffinHours * msInOneHour), y: 0});
        diffinHours--;
      }
    }    
  }

  return result;
};

clients.diffInHours = function(start, end) {
  var diffInMs = end - start;
  return diffInMs / (1000 * 60 * 60) - 1;
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

clients.getClient = function(id, done) {
  data.getCollection('clients', function(e, collection) {
    if(e) {
      console.error(e);
      return done(e);
    }

    collection.findOne({_id: id}, function(e, client) {
      if(e) {
        console.error(e);
        return done(e);
      }

      return done(null, client);
    });
  });
};

module.exports = clients;