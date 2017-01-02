var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);
require('../commons/helpers');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var QUERY = require('../database/query');


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, agent, password, done) {
    connection.query(QUERY.AGENT.login, [agent], function (err, data) {
      if (err) {
        return done(null, false);
      } else {
        if (data.length === 1) {
          if (!bcrypt.compareSync(password, data[0].password)) {
            console.log('password is not matched.');
            return done(null, false);
          } else {
            console.log('password is matched.');
            return done(null, {
              'name' : data[0].name,
              'email' : data[0].email,
              'role' : data[0].role
            });
          }
        } else {
          return done(null, false);
        }
      }
    });
  }
));

router.get('/', isAuthenticated, function (req, res) {
  res.redirect('/dashboard');
});

router.get('/login', function (req, res) {
  if (req.user == null) {
    res.render('login', {
      current_path: 'Login',
      // 이 부분이 FC마다 변경되어야 하는 부분이다.
      title: PROJ_TITLE + 'Login'
    });
  } else {
    res.redirect('/dashboard');
  }
});

router.get('/login/:fcname', function (req, res) {
  // console.log( req.param("fcname") );
  var _fcname = req.param("fcname");
  console.log(_fcname);

  if (req.user == null) {
    res.render('login', {
      logo : _fcname,
      current_path: 'Login',
      title: _fcname + ', Login'
    });
  } else {
    res.redirect('/dashboard');
  }
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), function (req, res) {
    res.redirect('/dashboard');
  });

router.get('/logout', isAuthenticated, function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;