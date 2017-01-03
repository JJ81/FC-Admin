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

  connection.query(QUERY.COURSE.GetCourseList,
    [req.user.fc_id], function (err, rows) {
      res.render('course', {
        current_path: 'Course',
        title: PROJ_TITLE + 'Course',
        loggedIn: req.user,
        list : rows
      });
  });
});

router.get('/details', function (req, res) {
  var _id = req.query.id;
  res.render('course_details', {
    current_path: 'CourseDetails',
    title: PROJ_TITLE + 'Course Details',
    loggedIn: req.user,
    id : _id
    //list : rows
  });
});

module.exports = router;