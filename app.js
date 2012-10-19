var express = require('express'),
    index = require('./routes/index.js'),
    login = require('./routes/login.js'),
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

// server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
    console.error('here');
    if (req.session.user) {
        return next();
    }
    console.error('here');
    res.redirect('/login');
}