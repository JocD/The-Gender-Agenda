var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./routes/config');
var helpers = require('./routes/helpers');
var logo = config.logo;
var logoIcon = config.logoIcon;

var routes = require('./routes/index');
var contact = require('./routes/contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/:name', function(req,res, next){
  var file = req.params.name;
  if (file === 'robots.txt' || file === 'sitemap.xml') {
    res.sendFile(file, {
      root: __dirname + '/public/',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  else {
    next();
  }
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'semantic')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/contact', contact);

app.use(function (req, res, next) {
  helpers.categories()
    .then(function (val){
      res.categories = val;
      next();
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: err.message,
      error: err,
      logo: logo,
      categories: res.categories,
      logoIcon: logoIcon
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: err.message,
    error: {},
    categories: res.categories,
    logo: logo,
    logoIcon: logoIcon
  });
});


module.exports = app;
