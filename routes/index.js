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
const Excel = require('exceljs');
const convertExcel = require('excel-as-json').processFile;
const UTIL = require('../util/util');
const RegisterUserService = require('../service/RegisterUserService');
const async = require('async');
const fs = require('fs');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
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
          return done(null, false);
        } else {
          // console.log(data[0].fc_progress_bar_theme);
          return done(null, {
            'admin_id': data[0].admin_id,
            'name': data[0].name,
            'email': data[0].email,
            'role': data[0].role,
            'fc_id': data[0].fc_id,
            'fc_name': data[0].fc_name,
            'fc_theme': data[0].fc_theme,
            'fc_tile_theme': data[0].fc_tile_theme,
            'fc_pgbar_theme': data[0].fc_progress_bar_theme,
            'curdate': data[0].curdate
          });
        }
      } else {
        return done(null, false);
      }
    }
  });
}));

router.get('/', isAuthenticated, (req, res) => {
  if (req.user.role === 'supervisor') {
    res.redirect('/achievement');
  } else {
    res.redirect('/dashboard');
  }
});

router.get('/login', (req, res) => {
  var hostName = req.headers.host;
  var logoName = null;

  logoName = hostName.split('.')[1];
  logoName = logoName === undefined ? 'Orangenamu' : logoName;
  global.PROJ_TITLE = logoName + ', ';

  if (req.user == null) {
    res.render('login', {
      current_path: 'Login',
      title: global.PROJ_TITLE + 'Login',
      logo: logoName
    });
  } else {
    if (req.user.role === 'supervisor') {
      res.redirect('/achievement');
    } else {
      res.redirect('/dashboard');
    }
  }
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    if (req.user.role === 'supervisor') {
      res.redirect('/achievement');
    } else {
      res.redirect('/dashboard');
    }
  });

router.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/process', isAuthenticated, (req, res) => {
  var _path = req.query.url;
  var _msg = req.query.msg;
  var _comment = null;

  if (_msg === 'error') {
    _comment = '잘못된 입력값으로 인하여 처리가 되지 않았습니다.';
  }

  res.render('processing', {
    title: req.user.fc_name + ', 처리중입니다.',
    msg: _comment,
    path: _path
  });
});

// 아래는 공통로직으로 처리할 수 있도록 변경하자.
router.post('/admin/password/reset', isAuthenticated, (req, res) => {
  var _pass = req.body.pass.trim();
  var _repass = req.body.re_pass.trim();
  var _user_id = req.body.user_id.trim();
  var _name = req.body.user_name.trim();

  if (_pass !== _repass) {
    res.redirect('/process?url=employee&msg=error');
  } else {
    connection.query(QUERY.ADMIN.ResetPassword, [bcrypt.hashSync(_pass, 10), _user_id, _name],
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          if (req.user.role === 'supervisor') {
            res.redirect('/achievement');
          } else {
            res.redirect('/dashboard');
          }
        }
      });
  }
});

/**
 * 직원목록 엑셀 업로드
 */
router.post('/upload/excel/create/employee', isAuthenticated, (req, res, next) => {
  var filePath = null;
  var _form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: __dirname + '/../public/uploads/excel'
  });

  async.waterfall([
    // 폼 데이터를 formidable 로 피싱한다.
    (callback) => {
      _form.parse(req, (err, fields, files) => {
        filePath = files.file.path;
        callback(err, filePath);
      });
    },
    // 엑셀파일을 읽어들인다.
    // convertExcel 사용 시 Google excel 을 정상적으로 읽지 못하여, exceljs 로 변경
    (file_path, callback) => {
      // console.log("excel 체크 중.. 1");
      const wb = new Excel.Workbook();
      let result = [];

      wb.xlsx.readFile(file_path)
        .then(() => {
          let ws = wb.getWorksheet(1);
          let loop_index = 0;
          let loop_data = 0;

          ws.eachRow({
            includeEmpty: false
          }, (row, rowNumber) => {
            if (rowNumber >= 2) {
              result.push({
                row: rowNumber,
                branch: row.values[1] == undefined ? '' : UTIL.replaceEmptySpace(row.values[1]),
                duty: row.values[2] == undefined ? '' : UTIL.replaceEmptySpace(row.values[2]),
                name: row.values[3] == undefined ? '' : UTIL.replaceEmptySpace(row.values[3]),
                phone: UTIL.getDigitOnly(row.values[4] == undefined ? '' : UTIL.replaceEmptySpace(row.values[4])),
                email: row.values[5] == undefined ? '' : UTIL.replaceEmptySpace(row.values[5]),
                error: false,
                error_msg: []
              });

              loop_index = rowNumber - 2;
              loop_data = result[loop_index];

              // 필수입력값 체크
              for (let key in loop_data) {
                if (loop_data.hasOwnProperty(key) && key !== 'error' && key != 'error_msg') {
                  if (loop_data[key] === '') {
                    loop_data['error'] = true;
                    loop_data['error_msg'].push('필수입력값 누락');
                    break;
                  }
                }
              }

              // 잘못된 이메일 형식
              if (!UTIL.isValidEmail(loop_data.email)) {
                loop_data['error'] = true;
                loop_data['error_msg'].push('잘못된 이메일 형식');
              }

              // 잘못된 휴대폰번호 형식
              if (!UTIL.isValidPhone(loop_data.phone)) {
                loop_data['error'] = true;
                loop_data['error_msg'].push('잘못된 휴대폰번호 형식');
              }
            }
          });

          callback(null, result);
        });
    },
    // 엑셀데이터 2차 검증 (휴대폰번호)
    (excel_data_2, callback) => {
      // console.log("excel 체크 중.. 2");
      let phone = [];
      let row = null;
      let len = 0;
      let len2 = 0;
      let index = 0;
      let index2 = 0;

      for (index = 0, len = excel_data_2.length; index < len; index++) {
        row = excel_data_2[index];
        phone[index] = row.phone;
      }

      connection.query(QUERY.EDU.GetUserDataByPhone, [phone], (err, data) => {
        if (data.length > 0) {
          for (index = 0, len = data.length; index < len; index++) {
            for (index2 = 0, len2 = excel_data_2.length; index2 < len2; index2++) {
              if (data[index].phone === excel_data_2[index2].phone) {
                excel_data_2[index2]['error'] = true;
                excel_data_2[index2]['error_msg'].push('휴대폰번호 중복');
              }
            }
          }
        }

        callback(null, excel_data_2);
      });
    },
    // 엑셀데이터 3차 검증 (이메일)
    (excel_data_3, callback) => {
      // console.log("excel 체크 중.. 3");
      let email = [];
      let row = null;
      let len = 0;
      let len2 = 0;
      let index = 0;
      let index2 = 0;

      for (index = 0, len = excel_data_3.length; index < len; index++) {
        row = excel_data_3[index];
        email[index] = row.email;
      }

      connection.query(QUERY.EDU.GetUserDataByEmail, [email], (err, data) => {
        if (err) throw err;
        if (data.length > 0) {
          for (index = 0, len = data.length; index < len; index++) {
            for (index2 = 0, len2 = excel_data_3.length; index2 < len2; index2++) {
              if (data[index].email === excel_data_3[index2].email) {
                excel_data_3[index2]['error'] = true;
                excel_data_3[index2]['error_msg'].push('이메일 중복');
              }
            }
          }
        }

        callback(null, excel_data_3);
      });
    },
    // DB 입력
    (excel_data_4, callback) => {
      let data = {
        excel_data: excel_data_4,
        user: req.user
      };

      UserService.createUserByExcel(connection, data, (err, data) => {
        callback(err, excel_data_4);
      });
    },
    // 엑셀파일을 삭제한다.
    (excel_data_5, callback) => {
      UTIL.deleteFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          console.log('deleted file : ' + filePath);
          callback(null, excel_data_5);
        }
      });
    },
    // 오류가 있는 엑셀 데이터를 내보내기 한다.
    (excel_data_6, callback) => {
      if (excel_data_6.length > 0) {
        let row = null;
        let len = 0;
        let index = 0;
        const writeExcel = __dirname + '/../public/uploads/excel/regist_employee.xlsx'; // 쓰기에 사용할 엑셀파일
        const outputExcel = __dirname + '/../public/uploads/excel/fail_upload.xlsx'; // 내보내기에 사용할 엑셀파일

        UTIL.FileExists(writeExcel, function (err, data) {
          if (err) callback(err, null);
        });

        let wb = new Excel.Workbook();
        let excelRow = null;
        let errorRowsCount = 0;

        wb.xlsx.readFile(writeExcel)
          .then(function () {
            let ws = wb.getWorksheet(1);
            for (index = 0, len = excel_data_6.length; index < len; index++) {
              row = excel_data_6[index];

              if (row.error) {
                errorRowsCount++;
                excelRow = ws.getRow(index + 2);
                excelRow.getCell(1).value = row.branch;
                excelRow.getCell(2).value = row.duty;
                excelRow.getCell(3).value = row.name;
                excelRow.getCell(4).value = row.phone;
                excelRow.getCell(5).value = row.email;
                excelRow.getCell(6).value = row.error_msg.join(',');
                excelRow.commit();
              }
            }

            let excelCol = ws.getColumn(6);
            excelCol.width = 50;
          })
          .then(() => {
            return wb.xlsx.writeFile(outputExcel);
          })
          .then(() => {
            // 오류가 있을 경우 해당 데이터를 내보내기 한다.
            if (errorRowsCount > 0) {
              return res.download(outputExcel);
            }
            callback(null, null);
          });
      } else {
        callback(null, null);
      }
    }
    // function (){},
    // function (){},
  ],
  (err, results) => {
    if (err) {
      return res.json({
        success: false,
        msg: err
      });
    } else {
      // console.log(results);
      res.redirect('/employee');
    }
  });
});

const UserService = require('../service/UserService');
// 교육과정 배정 관리에서 엑셀을 업로드하고 로그 테이블에 저장해둘 경우
router.post('/upload/excel/register/employee', isAuthenticated, (req, res) => {
  var filePath = null;
  var form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: AppRoot + '/public/uploads/excel'
  });

  var _data = {
    group_name: null,
    group_desc: null,
    group_id: null,
    user_group: [] // user_id 저장소
  };

  _data.group_id = UTIL.publishHashByMD5(new Date());
  console.info(_data.group_id);

  // todo 트랜잭션을 걸어야 한다. 나중에 합시다.
  async.series(
    [
      // upload excel file
      (callback) => {
        form.parse(req, (err, fields, files) => {
          // 여기서 에러 처리가 나면 500페이지로 리턴 처리한다.
          if (err) {
            callback(err, null);
            throw new Error('upload error occurred.');
          }

          // fields를 통해서 _data에 값을 입력한다.
          // console.info(fields);

          _data.group_name = fields.group_name;
          _data.group_desc = fields.group_desc;

          filePath = files.file.path;
          callback(null, filePath);
        });
      },

      // todo 업로드한 엑셀을 읽으면서 user_id를 추출해서
      (callback) => {
        convertExcel(filePath, undefined, false, (err, data) => {
          if (err) {
            // 에러가 발생할 경우 500페이지로 리턴처리한다.
            // todo 여기서는 어떤 처리가 이루어질 것인지 확인하는 작업이 필요하다
            console.error(err);
            callback(err, null);
            throw new Error(err);
          } else {
            console.log('excel');
            console.info(data);

            // 가져온 데이터를 기반으로 디비를 조회하여 user_id를 모두 추출해야 한다.
            UserService.extractUserIdFromList(data, (err, result) => {
              if (err) {
                callback(err, null);
                throw new Error(err);
              } else {
                console.info('userId array');
                console.info(result);
                _data.user_group = result;
                callback(null, result);
              }
            });
            // callback(null, data);
          }
        });
      },

      // 그룹아이디와 함께 log_group_user 테이블에 insert
      (callback) => {
        // _data.user_group에 있는 배열을 돌면서 _data.group_id와 함께 log_group_user에 넣는다.
        UserService.insertUserDataInGroupUser(_data.user_group, _data.group_id, (err, result) => {
          if (err) {
            // callback(err, null);
            console.error(err);
          } else {
            callback(null, result);
          }
        });
      },

      // log_bind_user 테이블에 데이터 기록
      (callback) => {
        connection.query(QUERY.EDU.InsertIntoLogBindUser, [
          _data.group_name,
          _data.group_desc,
          req.user.fc_id,
          _data.group_id
        ],
          (err, result) => {
            if (err) {
              console.error(err);
              callback(err, null);
            } else {
              callback(null, result);
            }
          }
        );
      },

      // delete excel file
      (callback) => {
        UTIL.deleteFile(filePath, (err, result) => {
          if (err) {
            console.error(err);
            callback(err, null);
          } else {
            callback(null, result);
          }
        });
      }
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        throw new Error('err');
      }
      res.redirect('/assignment');
    });
});

module.exports = router;
