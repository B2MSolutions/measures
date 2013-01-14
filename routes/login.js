var authentication = require('../lib/authentication.js');

var login = {};

login.get = function(req, res) {
  res.render('login', { title: 'Login' });
};

login.post = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  authentication.validate(username, password, function(e, valid) {
    if(valid) {
      var redirect_to = req.session.redirect_to;
      req.session.regenerate(function() {
        req.session.user = { name: username };
        res.redirect(redirect_to);
      });      
    } else {
      res.redirect('/login');
    }
  });
};

module.exports = login;