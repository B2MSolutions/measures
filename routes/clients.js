var clients = {};
clients.versions = {};

clients.versions.get = function(req, res) {
  res.render('clientversions', { title: 'Client Version Measures' });
};

module.exports = clients;