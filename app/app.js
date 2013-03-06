
/**
 * Module dependencies.
 */

var express = require('express'),
    lactate = require('lactate'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    config = require('./config.js');

var app = express();
var staticMiddleware = lactate.static({
  root: path.join(__dirname, 'static'),
  gzip: true,
  headers: {
    'Cache-Control': 'public, max-age=1576800001',
    'Vary': 'Accept-Encoding'
  }
});

function csrf (req, res, next) {
  res.locals.token = req.session._csrf;
  next();
}

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'mmm');
  app.set('layout', 'layout');
  app.use(express.compress());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.session.secret }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.csrf());
  app.use(staticMiddleware);
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;

  app.get('/static/*', function (req, res, next) {
    req.url = req.url.replace(/^\/static/, '');
    staticMiddleware(req, res, next);
  });
});

app.configure('production', function () {
  app.use(express.errorHandler());
  //app.enable('trust proxy');
});


app.all('/*', function(req, res, next) {
  if (req.headers && req.headers.host && req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
});

app.get('/', csrf, routes.index);

app.post('/contact', csrf, routes.contact);

app.get('/contact', function (req, res) {
  res.redirect('/');
});

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

server.on('connection', function (socket) {
  socket.setTimeout(30 * 1000);
});


