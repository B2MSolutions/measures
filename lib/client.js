var client = { };

client.versions = function(done) {
  var data = [
    { name: 'A', version: 1 },
    { name: 'B', version: 2 },
    { name: 'C', version: 3 }
  ];

  done(null, data);
};

module.exports = client;