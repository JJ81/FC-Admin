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

  async.series(
    [
      function (callback) {
        connection.query(QUERY.COURSE.GetCourseList,
          [req.user.fc_id], function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, rows);
            }
          });
      },
      function (callback){
        connection.query(QUERY.COURSE.GetTeacherList,
          [req.user.fc_id],
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
    function (err, result){
      if(err){
        console.error(err);
      }else{
        res.render('course', {
          current_path: 'Course',
          title: PROJ_TITLE + 'Course',
          loggedIn: req.user,
          list : result[0],
          teacher_list : result[1]
        });
      }
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
      },
      function (callback){
        connection.query(QUERY.COURSE.GetTeacherList,
          [req.user.fc_id],
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
        res.render('course_details', {
          current_path: 'CourseDetails',
          title: PROJ_TITLE + 'Course Details',
          loggedIn: req.user,
          list : result[0],
          //rating: result[1][0].rate,
          rating: result[1],
          session_list: result[2],
          teacher_info : result[3],
          teacher_list : result[4]
        });
      }
  });
});


router.post('/create/teacher', function (req, res){
  var _name = req.body.teacher.trim();
  var _desc = req.body.teacher_desc.trim();

  connection.query(QUERY.COURSE.CreateTeacher,
    [_name, _desc, req.user.admin_id],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course');
      }
  });
});


router.post('/register', function (req, res) {
  var course_name = req.body.course_name.trim();
  var course_desc = req.body.course_desc.trim();
  var teacher = req.body.teacher_id.trim();
  var admin_id = req.user.admin_id;

  connection.query(QUERY.COURSE.CreateCourse,
    [
      course_name,
      teacher,
      course_desc,
      admin_id
    ],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course');
      }
  });
});

router.post('/modify', function (req, res) {
  var _course_id = req.body.course_id.trim();
  var _course_name = req.body.course_name.trim();
  var _course_desc = req.body.course_desc.trim();
  var _teacher_id = req.body.teacher_id.trim();

  connection.query(QUERY.COURSE.UpdateCourse,
    [
      _course_name,
      _teacher_id,
      _course_desc,
      req.user.admin_id,
      new Date(),
      _course_id
    ],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course/details?id=' + _course_id);
      }
  });
});


module.exports = router;