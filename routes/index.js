const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const QUERY = require('../database/query');
const formidable = require('formidable');
const Excel = require('exceljs');
const convertExcel = require('excel-as-json').processFile;
const util = require('../util/util');
const async = require('async');
const path = require('path');
const pool = require('../commons/db_conn_pool');
const UserService = require('../service/UserService');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, agent, password, done) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.LOGIN.login, [agent], (err, data) => {
      connection.release();
      if (err) {
        return done(null, false);
      } else {
        if (data.length === 1) {
          if (!bcrypt.compareSync(password, data[0].password)) {
            return done(null, false);
          } else {
            return done(null, {
              'admin_id': data[0].admin_id,
              'name': data[0].name,
              'email': data[0].email,
              'role': data[0].role,
              'fc_id': data[0].fc_id,
              'fc_name': data[0].fc_name,
              'curdate': data[0].curdate
            });
          }
        } else {
          return done(null, false);
        }
      }
    });
  });
}));

router.get('/', util.isAuthenticated, (req, res) => {
  if (req.user.role === 'supervisor') {
    res.redirect('/achievement');
  } else {
    res.redirect('/dashboard');
  }
});

router.get('/login', util.getLogoInfo, (req, res, next) => {
  if (req.user == null) {
    res.render('login', {
      title: '로그인',
      current_path: 'Login'
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
    console.log(req.user);
    if (req.user.role === 'supervisor') {
      res.redirect('/achievement');
    } else {
      res.redirect('/dashboard');
    }
  });

router.get('/logout', util.isAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

// 아래는 공통로직으로 처리할 수 있도록 변경하자.
router.post('/admin/password/reset', util.isAuthenticated, (req, res) => {
  const {
    pass: password,
    re_pass: passwordConfirmd,
    user_id: userId,
    user_name: userName
  } = req.body;

  if (password !== passwordConfirmd) {
    res.redirect('/process?url=employee&msg=error');
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.ADMIN.ResetPassword, [bcrypt.hashSync(password, 10), userId, userName],
        (err, result) => {
          connection.release();
          if (err) {
            console.error(err);
          } else {
            if (req.user.role === 'supervisor') {
              res.redirect('/achievement');
            } else {
              res.redirect('/dashboard');
            }
          }
        }
      );
    });
  }
});

/**
 * 직원목록 엑셀 업로드
 */
router.post('/upload/excel/create/employee', util.isAuthenticated, (req, res, next) => {
  let filePath = null;
  let _form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: path.join(__dirname, '/../public/uploads/excel')
  });

  pool.getConnection((err, connection) => {
    if (err) throw err;
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
      (filePath, callback) => {
        // console.log("excel 체크 중.. 1");
        const wb = new Excel.Workbook();
        let result = [];

        wb.xlsx.readFile(filePath)
          .then(() => {
            let ws = wb.getWorksheet(1);
            let loopIndex = 0;
            let loopData = 0;

            ws.eachRow({
              includeEmpty: false
            }, (row, rowNumber) => {
              if (rowNumber >= 2) {
                // email 이 hyperlink 일 경우
                // { text: 'hyoungia67@naver.com', hyperlink: 'mailto:hyoungia67@naver.com' } 이와 같이 넘어온다.
                let email = row.values[5];
                if (typeof email === 'object') {
                  email = util.replaceEmptySpace(email.text);
                }
                result.push({
                  row: rowNumber,
                  branch: row.values[1] == undefined ? '' : util.replaceEmptySpace(row.values[1]),
                  duty: row.values[2] == undefined ? '' : util.replaceEmptySpace(row.values[2]),
                  name: row.values[3] == undefined ? '' : util.replaceEmptySpace(row.values[3]),
                  phone: util.getDigitOnly(row.values[4] == undefined ? '' : util.replaceEmptySpace(row.values[4])),
                  email: email == undefined ? '' : email,
                  error: false,
                  error_msg: []
                });

                loopIndex = rowNumber - 2;
                loopData = result[loopIndex];

                // 필수입력값 체크
                // 제외할 필드
                const columnToUncheck = ['error', 'error_msg', 'email'];
                for (let key in loopData) {
                  if (loopData.hasOwnProperty(key) && (columnToUncheck.findIndex(x => x === key) === undefined)) {
                    if (loopData[key] === '') {
                      loopData['error'] = true;
                      loopData['error_msg'].push('필수입력값 누락');
                      break;
                    }
                  }
                }

                // 잘못된 이메일 형식
                console.log(loopData.email);
                if (loopData.email !== '' && !util.isValidEmail(loopData.email)) {
                  loopData['error'] = true;
                  loopData['error_msg'].push('잘못된 이메일 형식');
                }

                // 잘못된 휴대폰번호 형식

                // 앞자리가 0이 아닐 경우 자동으로 0을 추가합니다.
                if (loopData.phone.toString().substring(0, 1) !== '0') {
                  loopData.phone = '0' + loopData.phone;
                }
                if (!util.isValidPhone(loopData.phone)) {
                  loopData['error'] = true;
                  loopData['error_msg'].push('잘못된 휴대폰번호 형식');
                }
              }
            });
            callback(null, result);
          })
          .catch((error) => {
            console.log('wb error occurred!');
            console.log(error);
          });
      },
      // 엑셀데이터 2차 검증 (휴대폰번호)
      (dataToVerifyPhone, callback) => {
        console.log('휴대폰번호 체크중..');
        let phone = [];
        let row = null;
        let len = 0;
        let len2 = 0;
        let index = 0;
        let index2 = 0;

        for (index = 0, len = dataToVerifyPhone.length; index < len; index++) {
          row = dataToVerifyPhone[index];
          phone[index] = row.phone;
        }

        connection.query(QUERY.EMPLOYEE.GetActivatedUserByPhone, [phone], (err, data) => {
        // connection.query(QUERY.EDU.GetUserDataByPhone, [phone], (err, data) => {
          if (err) throw err;
          if (data.length > 0) {
            for (index = 0, len = data.length; index < len; index++) {
              for (index2 = 0, len2 = dataToVerifyPhone.length; index2 < len2; index2++) {
                if (data[index].phone === dataToVerifyPhone[index2].phone) {
                  dataToVerifyPhone[index2]['error'] = true;
                  dataToVerifyPhone[index2]['error_msg'].push('휴대폰번호 중복');
                }
              }
            }
          }
          callback(null, dataToVerifyPhone);
        });
      },
      // 엑셀데이터 3차 검증 (이메일)
      (dataToVerifyEmail, callback) => {
        console.log('이메일 체크중..');
        let email = [];
        let row = null;
        let len = 0;
        let len2 = 0;
        let index = 0;
        let index2 = 0;

        for (index = 0, len = dataToVerifyEmail.length; index < len; index++) {
          row = dataToVerifyEmail[index];
          if (row.email !== '') {
            email[index] = row.email;
          }
        }

        if (email.length > 0) {
          connection.query(QUERY.EDU.GetUserDataByEmail, [email], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
              for (index = 0, len = data.length; index < len; index++) {
                for (index2 = 0, len2 = dataToVerifyEmail.length; index2 < len2; index2++) {
                  if (data[index].email === dataToVerifyEmail[index2].email) {
                    dataToVerifyEmail[index2]['error'] = true;
                    dataToVerifyEmail[index2]['error_msg'].push('이메일 중복');
                  }
                }
              }
            }
          });
        }

        callback(null, dataToVerifyEmail);
      },
      // DB 입력
      (dataToInsert, callback) => {
        let data = {
          excel_data: dataToInsert,
          user: req.user
        };

        UserService.createUserByExcel(connection, data, (err, data) => {
          callback(err, dataToInsert);
        });
      },
      // 엑셀파일을 삭제한다.
      (dataToInsert, callback) => {
        util.deleteFile(filePath, (err, data) => {
          if (err) {
            console.error(err);
            callback(err, null);
          } else {
            console.log('deleted file : ' + filePath);
            callback(null, dataToInsert);
          }
        });
      },
      // 오류가 있는 엑셀 데이터를 내보내기 한다.
      (dataToExport, callback) => {
        if (dataToExport.length > 0) {
          let row = null;
          let len = 0;
          let index = 0;
          const writeExcel = path.join(__dirname, '/../public/uploads/excel/regist_employee.xlsx'); // 쓰기에 사용할 엑셀파일
          const outputExcel = path.join(__dirname, '/../public/uploads/excel/fail_upload.xlsx'); // 내보내기에 사용할 엑셀파일

          util.FileExists(writeExcel, (err, data) => {
            if (err) callback(err, null);
          });

          let wb = new Excel.Workbook();
          let excelRow = null;
          let errorRowsCount = 0;

          wb.xlsx.readFile(writeExcel)
            .then(() => {
              let ws = wb.getWorksheet(1);
              for (index = 0, len = dataToExport.length; index < len; index++) {
                row = dataToExport[index];

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
    ],
    (err, results) => {
      connection.release();
      if (err) {
        return res.json({
          success: false,
          msg: err
        });
      } else {
        res.redirect('/employee');
      }
    });
  });
});

// 교육과정 배정 관리에서 엑셀을 업로드하고 로그 테이블에 저장한다.
router.post('/upload/excel/register/employee', util.isAuthenticated, (req, res) => {
  let filePath = null;
  let form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: global.AppRoot + '/public/uploads/excel'
  });

  let _data = {
    group_name: null,
    group_desc: null,
    group_id: null,
    user_group: [] // user_id 저장소
  };

  _data.group_id = util.publishHashByMD5(new Date());
  console.info(_data.group_id);

  // todo 트랜잭션을 걸어야 한다. 나중에 합시다.
  pool.getConnection((err, connection) => {
    if (err) throw err;
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
          util.deleteFile(filePath, (err, result) => {
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
        connection.release();
        if (err) {
          console.error(err);
          throw new Error('err');
        }
        res.redirect('/assignment');
      });
  });
});

module.exports = router;
