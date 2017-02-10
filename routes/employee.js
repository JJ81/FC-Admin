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

var UTIL = require('../util/util');
var bcrypt = require('bcrypt');
var async = require('async');

router.get('/', isAuthenticated, function (req, res) {

  async.series([
    function (callback) {
      connection.query(QUERY.EMPLOYEE.GetEmployeeList, [req.user.fc_id], function (err, employee) {
        callback(err, employee);
      })
    },
    function (callback) {
      connection.query(QUERY.EMPLOYEE.GetBranch, [req.user.fc_id], function (err, branch) {
        callback(err, branch);
      })
    },
    function (callback) {
      connection.query(QUERY.EMPLOYEE.GetDuty, [req.user.fc_id], function (err, duty) {
        callback(err, duty);
      })
    }
  ],function (err, results){
    if(err){
      console.error(err);
    }else{

      //console.info(results);

      res.render('employee', {
        current_path: 'Employee',
        title: PROJ_TITLE + 'Employee',
        loggedIn: req.user,
        list : results[0],
        branch : results[1],
        duty : results[2]
      });
    }
  });
});

/**
 * 유저 생성
 */
router.post('/create', isAuthenticated, function (req, res, next) {
  var _data = {
    name : req.body.name.trim(),
    branch_id : req.body.branch.trim(), // id
    duty_id : req.body.duty.trim(), // id
    tel : req.body.tel.trim(),
    email : req.body.email.trim(),
    pass: req.body.pass.trim(),
    re_pass : req.body.re_pass.trim(),
    fc_id : req.user.fc_id // id
  };

  if (_data.pass !== _data.re_pass || 
     !UTIL.isValidPhone(_data.tel) ||
     !UTIL.isValidEmail(_data.email) || 
     !UTIL.checkPasswordSize(_data.pass, 4)) {
    // res.redirect('/process?url=employee&msg=error');
    return next({
        status: 500,
        message: "잘못된 형식의 휴대폰번호 또는 이메일이 존재합니다."
    });
  } else {
    _data.pass = bcrypt.hashSync(_data.pass, 10);

    connection.query(QUERY.EMPLOYEE.CreateEmployee, [
      _data.name,
      _data.pass,
      _data.email,
      _data.tel,
      _data.fc_id,
      _data.duty_id,
      _data.branch_id
    ], function (err, result){
      if(err){
        // console.error(err);
        // res.redirect('/process?url=employee&msg=error');
        if (err) 
            return next({
                status: 500,
                message: "중복된 휴대폰번호 또는 이메일이 존재합니다."
            });
      }else{
        res.redirect('/employee');
      }
    });
  }
});

/**
 * 유저 수정
 */
router.post('/modify', isAuthenticated, function (req, res, next) {
  
  var _data = {
    user_id : req.body.employee_id,
    name : req.body.name.trim(),
    branch_id : req.body.branch.trim(), // id
    duty_id : req.body.duty.trim(), // id
    tel : req.body.tel.trim(),
    email : req.body.email.trim(),
    fc_id : req.user.fc_id // id
  };

  console.log(_data);

  if (!UTIL.isValidPhone(_data.tel) ||
     !UTIL.isValidEmail(_data.email) ||
     _data.branch_id === '' || 
     _data.duty_id === ''
  ) {
    // res.redirect('/process?url=employee&msg=error');
    return next({
        status: 500,
        message: "잘못된 형식의 휴대폰번호 또는 이메일이 존재합니다."
    });    
  } else {

    connection.query(QUERY.EMPLOYEE.ModifyEmployee, [
      _data.name,
      _data.email,
      _data.tel,
      _data.branch_id,
      _data.duty_id,
      _data.user_id,
      _data.fc_id
    ], function (err, result){
      if(err){
        console.error(err);
        if (err) 
            return next({
                status: 500,
                message: "중복된 휴대폰번호 또는 이메일이 존재합니다."
            });        
      } else {
        res.redirect('/employee');
      }
    });
  }
});

/**
 * 지점 생성
 */
router.post('/create/branch', function (req, res) {
  var _name = req.body.name.trim();

  if(_name === null || _name === ''){
    res.redirect('/process?url=employee&msg=error');
  }else{
    // todo 동일한 fc에서의 지점이 중복인지 여부를 검사해야 한다
    connection.query(QUERY.EMPLOYEE.CreateBranch,
      [_name, req.user.fc_id], function (err, result) {
        if(err){
          console.error(err);
        }else{
          res.redirect('/employee');
        }
      });
  }
});

/**
 * 지점 수정하기
 */
router.post('/modify/branch', function (req, res) {

  var _name = req.body.name.trim();

  if(_name === null || _name === ''){
    res.redirect('/process?url=employee&msg=error');
  } else {
    connection.query(QUERY.EMPLOYEE.ModifyBranch,
      [ _name, req.body.id], function (err, result) {
        if(err){
          console.error(err);
        }else{
          res.redirect('/employee');
        }
      });
  }
});

/**
 * 직책 생성
 */
router.post('/create/duty', function (req, res) {
  var _name = req.body.name.trim();

  if(_name === null || _name === ''){
    res.redirect('/process?url=employee&msg=error');
  }else{
    // todo 동일한 fc에서의 직책이 중복인지 여부를 검사해야 한다
    connection.query(QUERY.EMPLOYEE.CreateDuty,
      [ _name, req.user.fc_id], function (err, result) {
        if(err){
          console.error(err);
        }else{
          res.redirect('/employee');
        }
      });
  }
});

/**
 * 직책 수정하기
 */
router.post('/modify/duty', function (req, res) {

  var _name = req.body.name.trim();

  if(_name === null || _name === ''){
    res.redirect('/process?url=employee&msg=error');
  } else {
    // todo 동일한 fc에서의 지점이 중복인지 여부를 검사해야 한다
    connection.query(QUERY.EMPLOYEE.ModifyDuty,
      [ _name, req.body.id], function (err, result) {
        if(err){
          console.error(err);
        }else{
          res.redirect('/employee');
        }
      });
  }
});

/**
 * 암호 재설정
 */
router.post('/password/reset', function (req, res) {
  var _pass = req.body.pass.trim();
  var _repass = req.body.re_pass.trim();
  var _user_id = req.body.user_id.trim();
  var _name = req.body.user_name.trim();

  console.info(req.originalUrl);

  if(_pass !== _repass || _user_id === '' || _name === ''){
    res.redirect('/process?url=employee&msg=error');
  }else{
    connection.query(QUERY.EMPLOYEE.ResetPassword,
      [bcrypt.hashSync(_pass, 10), _user_id, _name],
      function (err, result) {
        if(err){
          console.error(err);
        }else{
          res.redirect('/employee');
        }
    });
  }
});

module.exports = router;