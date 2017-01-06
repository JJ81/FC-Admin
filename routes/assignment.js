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
  connection.query(QUERY.EDU.GetCustomUserList,
    [req.user.fc_id],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.render('assignment', {
          current_path: 'Assignment',
          title: PROJ_TITLE + 'Assignment',
          loggedIn: req.user,
          list : rows
        });
      }
  });
});

router.get('/details', isAuthenticated, function (req, res) {
  var _id = req.query.id;
  var _group = req.query.group_id;

  async.series(
    [
      function (callback) {
        connection.query(QUERY.EDU.GetAssignmentDataById, [_id], function (err, rows) {
          if(err){
            console.error(err);
            callback(err, null);
          }else{
            callback(null, rows);
          }
        });
      },
      function (callback) {
        connection.query(QUERY.EDU.GetUserListByGroupId, [_group], function (err, rows) {
          if(err){
            console.error(err);
            callback(err, null);
          }else{
            callback(null, rows);
          }
        });
      },

      function (callback) {
        connection.query(QUERY.EDU.GetList,[req.user.fc_id], function (err, rows) {
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
        throw new Error(err);
      }else{
        res.render('assignment_details', {
          current_path: 'AssignmentDetails',
          title: PROJ_TITLE + 'Assignment Details',
          loggedIn: req.user,
          detail : result[0],
          detail_list : result[1],
          edu_list : result[2]
        });
      }
  });
});


// 특정 그룹에 교육을 배정한다.
router.post('/allocation/edu', function (req, res) {
  var _group_id = req.body.group_id; // 교육 대상자 그룹 아이디
  var _edu_id = req.body.edu_list; // 교육 아이디


  // todo log_group_user 테이블애서 그룹 아이디로 user_id를 배열로 추출한다.

  // todo training_edu에 데이터를 입력한 후에 리턴 받은 아이디를 들고 (training_edu)

  // todo loop를 돌면서 training_users에 유저의 데이터를 입력 한다. (training_users)



  // todo 오류 처리할 내용들
  // todo 배정에 오류가 난 경우 처리는 어떻게 할 것인가?
  // todo 미배정자의 경우 요청이 들어올 경우, 별도로 직원관리에서 개인적으로 배정을 할 수는 있다.
  // 이 때 문제가 되는 건 진척도 관리시 누락되어서 이후에 배정한 유저들의 교육 진척도가 그룹에 합산되어 나오느냐에 있다.
  // todo transaction 처리는 어떻게 할 것인가?

  async.waterfall(
    [
      function (callback) {

      }
    ],
    function (err, result) {
      if(err){
        console.error(err);
        throw new Error(err);
      }else{
        res.rediect('/assignment');
      }
  });
});


module.exports = router;