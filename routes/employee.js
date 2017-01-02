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
      connection.query(QUERY.EMPLOYEE.GETBRANCH, [req.user.fc_id], function (err, branch) {
        callback(err, branch);
      })
    },
    function (callback) {
      connection.query(QUERY.EMPLOYEE.GETDUTY, [req.user.fc_id], function (err, duty) {
        callback(err, duty);
      })
    }
  ],function (err, results){
    if(err){
      console.error(err);
    }else{

      console.info(results);

      res.render('employee', {
        current_path: 'Employee',
        title: PROJ_TITLE + 'Employee',
        loggedIn: req.user,
        branch : results[0],
        duty : results[1]
      });
    }
  });

});

router.post('/create', isAuthenticated, function (req, res) {
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

  if(_data.pass !== _data.re_pass || !UTIL.checkOnlyDigit(_data.tel)
    || !UTIL.isValidEmail(_data.email) || !UTIL.checkPasswordSize(_data.pass, 4)){
    res.redirect('/process?url=employee&msg=error');
  }else{
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
        console.error(err);
      }else{
        res.redirect('/employee');
      }
    });
  }
});



module.exports = router;