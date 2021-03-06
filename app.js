var authentication = require('./lib/authentication.js'),
    express = require('express'),
    clients = require('./routes/clients.js'),
    data = require('./lib/data.js'),
    index = require('./routes/index.js'),
    login = require('./routes/login.js'),
    versions = require('./routes/versions.js'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('club account poetry choose'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// unauthenticated
app.get('/login', login.get);
app.post('/login', login.post);

// authenticated
app.get('/', ensureAuthenticated, index.get);
app.get('/clients/versions', ensureAuthenticated, clients.get);
app.get('/clients/list', ensureAuthenticated, clients.list);
app.get('/client/:name', ensureAuthenticated, clients.getOne);
app.get('/client/statistics/:name', ensureAuthenticated, clients.getStatistics);
app.get('/client/usage/:name', ensureAuthenticated, clients.viewUsage);
app.get('/client/usage/data/:name', ensureAuthenticated, clients.getUsage);
app.post('/client', ensureAuthenticated, clients.update);

app.get('/versions/latest', ensureAuthenticated, versions.latest);
app.post('/version', ensureAuthenticated, versions.update);

// data
console.log('opening database');
data.open(function(e) {
  if(e) {
    console.error(e);
    return;
  }

  console.log('database opened');
  // server
  http.createServer(app).listen(app.get('port'), function() {
    console.log("server listening on port " + app.get('port'));
  });
});

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }

    var username = req.headers.username;
    var password = req.headers.password;
    
    if(username && password) {
      authentication.validate(username, password, function(e, valid) {
        if(valid) {
          console.log('authenticated using headers');
          req.session.user = { name: username };
          return next();
        } else {
          console.log('not authenticated (invalid headers)');
          req.session.redirect_to = req.path;
          return res.redirect('/login');          
        }
      });
    } else {
      console.log('not authenticated');
      req.session.redirect_to = req.path;
      return res.redirect('/login');
    }
}