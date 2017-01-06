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
const QUERY = require('../database/query');

const formidable = require('formidable');
const convertExcel = require('excel-as-json').processFile;
const UTIL = require('../util/util');
const RegisterUserService = require('../service/RegisterUserService');
const async = require('async');

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
    connection.query(QUERY.LOGIN.login, [agent], function (err, data) {
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
              'admin_id' : data[0].admin_id,
              'name' : data[0].name,
              'email' : data[0].email,
              'role' : data[0].role,
              'fc_id' : data[0].fc_id,
              'fc_name' : data[0].fc_name
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
  // todo get Hostname
  var _hostname = req.headers.host;
  var _logo = null;
  if(_hostname.indexOf('clipplr') != -1){
    _logo = 'Clipplr';
  }
  // console.info('!!! ' + _hostname);

  if (req.user == null) {
    res.render('login', {
      current_path: 'Login',
      title: _logo + ', Login',
      logo : _logo
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

router.get('/process', isAuthenticated, function (req, res) {
  var _path = req.query.url;
  var _msg = req.query.msg;
  var _comment = null;


  // todo 여러가지 처리 과정을 넣어서 처리할 수 있도록 한다.

  if(_msg === 'error'){
    _comment = '잘못된 입력값으로 인하여 처리가 되지 않았습니다.';
  }


  res.render('processing', {
    title : req.user.fc_name + ', 처리중입니다.',
    msg : _comment,
    path : _path
  });
});



// 아래는 공통로직으로 처리할 수 있도록 변경하자.
router.post('/admin/password/reset', isAuthenticated, function (req, res) {
  var _pass = req.body.pass.trim();
  var _repass = req.body.re_pass.trim();
  var _user_id = req.body.user_id.trim();
  var _name = req.body.user_name.trim();

  if(_pass !== _repass){
    res.redirect('/process?url=employee&msg=error');
  }else{
    connection.query(QUERY.ADMIN.ResetPassword,
      [bcrypt.hashSync(_pass, 10), _user_id, _name],
      function (err, result) {
        if(err){
          console.error(err);
        }else{
          res.redirect('/dashboard');
        }
      });
  }
});

// 엑셀 파일 업로드하기
router.post('/upload/excel/create/employee', isAuthenticated, function (req, res, next) {
  var _file_path = null;
  var form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: AppRoot + '/public/uploads/excel'
  });

  async.waterfall(
    [
      function(callback){
        form.parse(req, function (err, fields, files) {
          // 여기서 에러 처리가 나면 500페이지로 리턴 처리한다.
          if(err){
            callback(err, null);
            throw new Error('upload error occurred.');
          }

          _file_path = files.file.path;
          callback(null, _file_path);
        });
      },

      function (_file_path, callback){
        convertExcel(_file_path, undefined, false, function (err, data) {
          if(err){
            // 에러가 발생할 경우 500페이지로 리턴처리한다.
            console.error(err);
            throw new Error(err);
          }else{
            callback(null, data);
          }
        });
      },

      function (data, callback) {
        RegisterUserService.createUser(data, req.user.fc_id, function (err, ret) {
          // console.info('C');
          if(err){
            // todo 임시 에러 메시지 저장소에 저장을 해놓는다. 세션에 임시로 저장하고 페이지에 보여줄 수 있도록 한다.
            if(err.length > 0){
              console.error('[ERROR on RegisterUserService] ' + err);
            }
          }
          callback(null, ret);
        });
      },

      function (ret, callback) {
        UTIL.deleteFile(_file_path, function (err, result) {
          if(err){
            console.error(err);
            callback(err, null);
          }else{
            callback(null, result);
          }
        });
      }

    ],
    function (err, result){
      console.info('E');
      if(err){
        console.error(err);
        // [선택사항] 에러가 검출되었을 경우 에러 메시지를 보여줄 수 있는 페이지로 이동하여 에러를 볼 수 있도록 한다.
        //
      }else{
        res.redirect('/employee');
      }
  });
});

const UserService = require('../service/UserService');
// 교육과정 배정 관리에서 엑셀을 업로드하고 로그 테이블에 저장해둘 경우
router.post('/upload/excel/register/employee', isAuthenticated, function (req, res) {
  var _file_path = null;
  var form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: AppRoot + '/public/uploads/excel'
  });

  var _data = {
    group_name : null,
    group_desc : null,
    group_id : null,
    user_group : [] // user_id 저장소
  };

  _data.group_id = UTIL.publishHashByMD5(new Date());
  console.info(_data.group_id);

  // todo 트랜잭션을 걸어야 한다. 나중에 합시다.
  async.series(
    [
      // upload excel file
      function (callback){
        form.parse(req, function (err, fields, files) {
          // 여기서 에러 처리가 나면 500페이지로 리턴 처리한다.
          if(err){
            callback(err, null);
            throw new Error('upload error occurred.');
          }

          // fields를 통해서 _data에 값을 입력한다.
          // console.info(fields);

          _data.group_name = fields.group_name;
          _data.group_desc = fields.group_desc;

          _file_path = files.file.path;
          callback(null, _file_path);
        });
      }

      // todo 업로드한 엑셀을 읽으면서 user_id를 추출해서
      ,function(callback){
        convertExcel(_file_path, undefined, false, function (err, data) {
          if(err){
            // 에러가 발생할 경우 500페이지로 리턴처리한다.
            // todo 여기서는 어떤 처리가 이루어질 것인지 확인하는 작업이 필요하다
            console.error(err);
            callback(err, null);
            throw new Error(err);
          }else{

            console.log('excel');
            console.info(data);

            // 가져온 데이터를 기반으로 디비를 조회하여 user_id를 모두 추출해야 한다.
            UserService.extractUserIdFromList(data, function (err, result) {
              if(err){
                callback(err, null);
                throw new Error(err);
              }else{
                console.info('userId array');
                console.info(result);
                _data.user_group = result;
                callback(null, result);
              }
            });
            // callback(null, data);
          }
        });
      }

      // 그룹아이디와 함께 log_group_user 테이블에 insert
      ,function (callback) {
        // _data.user_group에 있는 배열을 돌면서 _data.group_id와 함께 log_group_user에 넣는다.
        UserService.insertUserDataInGroupUser(_data.user_group, _data.group_id, function (err, result){
          if(err){
            //callback(err, null);
            console.error(err);
          }else{
            callback(null, result);
          }
        });
      }

      // log_bind_user 테이블에 데이터 기록
      ,function (callback) {
        connection.query(QUERY.EDU.InsertIntoLogBindUser,
          [
            _data.group_name,
            _data.group_desc,
            req.user.fc_id,
            _data.group_id
          ],
          function (err, result) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, result);
            }
          });
      }

      // delete excel file
      ,function (callback) {
        UTIL.deleteFile(_file_path, function (err, result) {
          if(err){
            console.error(err);
            callback(err, null);
          }else{
            callback(null, result);
          }
        });
      }
    ],

    function(err, result){
      if(err){
        console.error(err);
        throw new Error('err');
      }
      res.redirect('/assignment');
  });
});


module.exports = router;