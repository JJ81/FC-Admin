var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();
var QUERY = require('../database/query');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
require('../commons/helpers');

router.get('/', isAuthenticated, function (req, res) {
  res.render('dashboard', {
    current_path: 'Dashboard',
    title: PROJ_TITLE + 'Dashboard',
    loggedIn: req.user
  });
});

module.exports = router;