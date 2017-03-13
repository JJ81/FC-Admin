var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

/* routes */
var routes = require('./routes/index'); // all about login
var dashboard = require('./routes/dashboard');
var employee = require('./routes/employee');
var education = require('./routes/education');
var assignment = require('./routes/assignment');
var assignmentHistory = require('./routes/assignment_history');
var course = require('./routes/course');
var achievement = require('./routes/achievement');
var administrator = require('./routes/administrator');
var documentation = require('./routes/documentation');
const api = require('./routes/api');

/* routes */
var app = express();
var hbs = require('hbs');
var passport = require('passport');
var flash = require('connect-flash');
var cookieSession = require('cookie-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));
hbs.registerPartials(path.join(__dirname, '/views/modal'));

app.use('/static', express.static(path.join(__dirname, '/dist')));

// todo favicon 설정할 것
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

global.PROJ_TITLE = 'Orangenamu, Backoffice ';
global.AppRoot = process.env.PWD;

// app.use(helmet.xssFilter());
// app.use(helmet.noCache());
// app.use(helmet.noSniff());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());

app.use(cookieSession({
  keys: ['FC_Admin'],
  cookie: {
    maxAge: 1000 * 60 // * 60 // 유효기간 1시간
  }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes);
app.use('/dashboard', dashboard);
app.use('/employee', employee);
app.use('/education', education);
app.use('/assignment', assignment);
app.use('/assignment_history', assignmentHistory);
app.use('/course', course);
app.use('/achievement', achievement);
app.use('/administrator', administrator);
app.use('/documentation', documentation);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
