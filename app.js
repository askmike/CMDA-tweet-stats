// dependencies
var express = require('express')
  , http = require('http')
  , path = require('path');

// mongoose
require( './db' );

// app
var app = express();

// config
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// routes
var routes = require('./routes')
app.get('/', routes.index);
app.get('/tweetsperday', routes.tweetsperday);
app.get('/users', routes.users);
app.get('/data', routes.data);

// launch
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
