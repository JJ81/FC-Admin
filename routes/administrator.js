const express = require('express');
const router = express.Router();
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'supervisor') {
      return res.redirect('achievement');
    }
    return next();
  }
  res.redirect('/login');
};
require('../commons/helpers');
const bcrypt = require('bcrypt');
const util = require('../util/util');
const async = require('async');
const UserService = require('../service/UserService');

/**
 * 관리자 리스트, 지점리스트를 가져온다.
 */
router.get('/', isAuthenticated, (req, res) => {
  async.series(
    [
      (callback) => {
        connection.query(QUERY.ADMIN.GetList, [req.user.fc_id], (err, results) => {
          callback(err, results);
        });
      },
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetBranch, [req.user.fc_id], (err, results) => {
          callback(err, results);
        });
      }
    ],
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.render('administrator', {
          current_path: 'Administrator',
          title: PROJ_TITLE + 'administrator',
          loggedIn: req.user,
          list: results[0],
          branches: results[1]
        });
      }
    }
  );
});

/**
 * 슈퍼바이저의 지점리스트를 조회한다.
 */
router.get('/branch/:admin_id', isAuthenticated, (req, res) => {
  const admin_id = req.params.admin_id;

  connection.query(QUERY.ADMIN.GetAdminBranch, [admin_id, req.user.fc_id], (err, results) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        list: results
      });
    }
  });
});

/**
 * 정보 입력
 */
router.post('/register', isAuthenticated, (req, res, next) => {
  let _data = {};
  _data.name = req.body.name.trim();
  _data.email = req.body.email.trim();
  _data.role = req.body.authority.trim();
  _data.pass = req.body.pass.trim();
  _data.re_pass = req.body.re_pass.trim();

  if (
    _data.pass !== _data.re_pass ||
    _data.name === '' ||
    _data.email === '' ||
    _data.pass === '' ||
    _data.re_pass === '' ||
    !util.isValidEmail(_data.email) ||
    !util.checkPasswordSize(_data.pass, 4)
    ) {
    return next({
      status: 500,
      message: '잘못된 형식의 이메일이 존재합니다.'
    });
  } else {
    connection.query(QUERY.ADMIN.CreateAdmin,
      [
        _data.name,
        _data.email,
        bcrypt.hashSync(_data.pass, 10),
        _data.role,
        req.user.fc_id
      ],
      (err, result) => {
        if (err) {
          return next({
            status: 500,
            message: '중복된 이메일이 존재합니다.'
          });
        } else {
          res.redirect('/administrator');
        }
      }
    );
  }
});

/**
 * 정보 수정
 */
router.post('/modify', isAuthenticated, (req, res, next) => {
  let _data = {};
  _data.id = req.body.employee_id;
  _data.name = req.body.name.trim();
  _data.email = req.body.email.trim();

  if (
    _data.name === '' ||
    _data.email === '' ||
    !util.isValidEmail(_data.email)
  ) {
    // res.redirect('/process?url=administrator&msg=error');
    return next({
      status: 500,
      message: '잘못된 형식의 이메일이 존재합니다.'
    });
  } else {
    connection.query(QUERY.ADMIN.ModifyAdmin,
      [
        _data.name,
        _data.email,
        _data.id
      ],
      (err, result) => {
        if (err) {
          return next({
            status: 500,
            message: '중복된 이메일이 존재합니다.'
          });
        } else {
          res.redirect('/administrator');
        }
      }
    );
  }
});

/**
 * 비번변경
 */
router.post('/password/reset', (req, res) => {
  const _pass = req.body.pass.trim();
  const _repass = req.body.re_pass.trim();
  const _user_id = req.body.user_id.trim();

  if (_pass !== _repass || _user_id === '') {
    res.redirect('/process?url=administrator&msg=error');
  } else {
    connection.query(QUERY.ADMIN.ResetPassword,
      [bcrypt.hashSync(_pass, 10), _user_id],
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.redirect('/administrator');
        }
      }
    );
  }
});

/**
 * 권한수정
 */
router.post('/role/reset', (req, res) => {
  const _role = req.body.authority.trim();
  const _user_id = req.body.user_id.trim();

  if (_role === '' || _user_id === '') {
    res.redirect('/process?url=administrator&msg=error');
  } else {
    connection.query(QUERY.ADMIN.ResetRole,
      [_role, _user_id],
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.redirect('/administrator');
        }
      }
    );
  }
});

/**
 * 슈퍼바이저에게 지점을 배정한다.
 * 슈퍼바이저의 지점을 모두 삭제한 후 다시 넣는다.
 */
router.post('/assign/branch', (req, res) => {
  const _user_id = req.body.user_id.trim();
  const _branch_list = req.body.branch_list;

  if (!_branch_list.length) {
    res.redirect('/process?url=administrator&msg=error');
  } else {
    connection.beginTransaction((err) => {
      if (err) {
        return res.json({
          success: false,
          msg: err
        });
      }
      async.series(
        [
          (callback) => {
            // 슈퍼바이저의 지점을 모두 삭제한다.
            connection.query(QUERY.ADMIN.DeleteAdminBranch,
              [
                _user_id
              ],
              (err, data) => {
                callback(err, data);
              }
            );
          },
          (callback) => {
            // 두 번째 쿼리
            connection.query(QUERY.ADMIN.InsertAdminBranch,
              [ _branch_list ],
              (err, data) => {
                callback(err, data);
              }
            );
          }
        ],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.json({
                success: false,
                msg: err
              });
            });
          } else {
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  res.json({
                    success: false,
                    msg: err
                  });
                });
              }
              res.json({
                success: true
              });
            });
          }
        });
    });
  }
});

/** 직원 비활성화 */
router.delete('/', isAuthenticated, (req, res, next) => {
  UserService.deactivateAdminById(req.query.id, (err, data) => {
    if (err) {
      return res.json({
        success: false,
        msg: err
      });
    }
    return res.json({
      success: true
    });
  });
});

module.exports = router;
