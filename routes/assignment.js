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

const UserService = require('../service/UserService');

// 특정 그룹에 교육을 배정한다.
router.post('/allocation/edu', function (req, res) {
  var _group_id = req.body.group_id; // 교육 대상자 그룹 아이디
  var _edu_id = req.body.edu_list; // 교육 아이디
  var _bind_user_id = req.body.bind_group_id;

  connection.beginTransaction(function () {
    async.waterfall(
      [
        // todo group_id를 통해서 유저 배열을 들고 온다.
        function (callback) {
          UserService.extractUserIdByGroupId(_group_id, function (err, result) {
            if(err){
              callback(err, null);
              console.error(err);
            }else{
              console.info('extract user info');
              console.info(result);
              callback(null, result);
            }
          });
        },

        // todo  training_edu 테이블에 입력 edu_id
        function (user_id, callback) {
          connection.query(QUERY.EDU.InsertTrainingEdu, [_edu_id, req.user.admin_id], function (err, result) {
            if(err){
              callback(err, null);
              throw new Error(err);
            }else{
              console.info('extract training_edu_id');
              console.info(result);
	            console.info(result.insertId);

              callback(null, user_id, result);
            }
          });
        },

	      // bug 입력 진행이 되지 않는다 이것을 추적할 것 : 원인 진단 -> training_edu id값을 참조하여 training_uesrs에 입력을 해야 하나 참조가 되려면 미리 데이터가 입력되어야 가능하도록 작동중이다
	      // 그래서 임의로 일단 참조 관계를 끊어놓는다
        // todo 리턴받은 training_edu_id, user_id를 가지고 training_users 테이블에 입력한다. 이 때 손실된 데이터가 생겼을 경우 다시 로그를 남기고 관리자가 알 수 있도록 해야 한다.
        function (user_id, result, callback) {
          UserService.InsertUsersWithTrainingEduId(user_id, result.insertId, function (err, ret) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
	            console.log('insert users trainig_users');
              callback(null, result.insertId);
            }
          });
        },

        // todo log_assign_edu 테이블에 log_bind_edu id와 training_edu id를 입력한다.
        function (training_edu_id, callback) {
          // _bind_user_id
          connection.query(QUERY.HISTORY.InsertIntoLogAssignEdu,
            [training_edu_id, _bind_user_id],
            function (err, ret) {
              if(err){
                console.error(err);
                callback(err, null);
              }else{
	              console.log('log_assign_edu');
                callback(null, ret);
              }
          });
        }
      ],

      function (err, result) {
        if(err){
          console.error(err);
          connection.rollback();
          throw new Error(err);
        }else{
          //connection.rollback();
          connection.commit();
          res.redirect('/assignment');
        }
    });
  }); // transaction

});


module.exports = router;