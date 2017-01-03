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
const async = require('async');

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

  async.series(
    [
      function(callback){
        connection.query(QUERY.COURSE.GetCourseListById,
          [req.user.fc_id, _id], function (err, rows) {
            if(err){
              callback(err, null);
              // todo 쿼리에 문제가 일어난 것이므로 500 페이지로 이동시킨다.
            }else{
              callback(null, rows);
            }
          });
      },
      function (callback) {
        connection.query(QUERY.COURSE.GetStarRatingByCourseId,
          [_id],
          function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, rows);
            }
        });
      },
      function (callback) {
        connection.query(QUERY.COURSE.GetSessionListByCourseId,
          [_id],
          function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, rows);
            }
        });
      },
      function (callback) {
        connection.query(QUERY.COURSE.GetTeacherInfoByCourseId,
          [_id],
          function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, rows);
            }
        });
      }
    ],
    function (err, result) {
      if(err){
        console.error(err);
      }else{

        console.log(result[3]);
        res.render('course_details', {
          current_path: 'CourseDetails',
          title: PROJ_TITLE + 'Course Details',
          loggedIn: req.user,
          list : result[0],
          rating: result[1][0].rate,
          session_list: result[2],
          teacher_info : result[3]
        });
      }
  });
});

module.exports = router;