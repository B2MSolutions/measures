var login = {};

login.get = function(req, res) {
  res.render('login', { title: 'Login' });
};

login.post = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if(username === process.env['MEASURES_USER'] && password === process.env['MEASURES_PASSWORD']) {
    req.session.regenerate(function() {
      req.session.user = { name: username };
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
};

module.exports = login;