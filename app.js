const express = require('express');
const cors = require('cors');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');

/* routes */
const routes = require('./routes/index'); // all about login
const dashboard = require('./routes/dashboard');
const employee = require('./routes/employee');
const education = require('./routes/education');
const assignment = require('./routes/assignment');
const assignmentHistory = require('./routes/assignment_history');
const simpleAssignment = require('./routes/simple_assignment');
const course = require('./routes/course');
const achievement = require('./routes/achievement');
const administrator = require('./routes/administrator');
const api = require('./routes/api');
const board = require('./routes/board');

/* routes */
const app = express();
const hbs = require('hbs');
const helper = require('./commons/helpers');
const passport = require('passport');
const flash = require('connect-flash');
const cookieSession = require('cookie-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));
hbs.registerPartials(path.join(__dirname, '/views/modal'));

app.use('/static', express.static(path.join(__dirname, '/dist')));

// todo favicon 설정할 것
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// global.PROJ_TITLE = 'Orangenamu, Backoffice ';
global.AppRoot = process.env.PWD;

app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());

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

app.use(cors({
  origin: ['http://localhost:3001'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/', routes);
app.use('/dashboard', dashboard);
app.use('/employee', employee);
app.use('/education', education);
app.use('/assignment', assignment);
app.use('/assignment_history', assignmentHistory);
app.use('/simple_assignment', simpleAssignment);
app.use('/course', course);
app.use('/achievement', achievement);
app.use('/administrator', administrator);
app.use('/api/v1', api);
app.use('/board', board);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
