const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const bcrypt = require('bcrypt');
const util = require('../util/util');
const async = require('async');
const pool = require('../commons/db_conn_pool');
const UserService = require('../service/UserService');

/**
 * 관리자 리스트, 지점리스트를 가져온다.
 */
router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        (callback) => {
          let q = connection.query(QUERY.ADMIN.GetList, [req.user.admin_id, req.user.fc_id], (err, results) => {
            console.log(results);
            console.log(q.sql);
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
        connection.release();
        if (err) {
          console.error(err);
        } else {
          res.render('administrator', {
            current_path: 'Administrator',
            title: '관리자',
            loggedIn: req.user,
            list: results[0],
            branches: results[1]
          });
        }
      }
    );
  });
});

/**
 * 슈퍼바이저의 지점리스트를 조회한다.
 */
router.get('/branch/:admin_id', util.isAuthenticated, (req, res) => {
  const { admin_id: adminId } = req.params;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.ADMIN.GetAdminBranch, [adminId, req.user.fc_id], (err, results) => {
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
});

/**
 * 정보 입력
 */
router.post('/register', util.isAuthenticated, (req, res, next) => {
  const {
    name: userName,
    email: userEmail,
    authority: role,
    pass: password,
    re_pass: passwordConfirmd
  } = req.body;

  if (
    password !== passwordConfirmd ||
    userName === '' ||
    userEmail === '' ||
    password === '' ||
    passwordConfirmd === '' ||
    !util.isValidEmail(userEmail) ||
    !util.checkPasswordSize(password, 4)
    ) {
    return next({
      status: 500,
      message: '잘못된 형식의 이메일이 존재합니다.'
    });
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.ADMIN.CreateAdmin,
        [
          userName,
          userEmail,
          bcrypt.hashSync(password, 10),
          role,
          req.user.fc_id
        ],
        (err, result) => {
          connection.release();
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
    });
  }
});

/**
 * 정보 수정
 */
router.post('/modify', util.isAuthenticated, (req, res, next) => {
  const { employee_id: id, name: userName, email: userEmail } = req.body;

  if (
    userName === '' ||
    userEmail === '' ||
    !util.isValidEmail(userEmail)
  ) {
    return next({
      status: 500,
      message: '잘못된 형식의 이메일이 존재합니다.'
    });
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.ADMIN.ModifyAdmin,
        [
          userName,
          userEmail,
          id
        ],
        (err, result) => {
          connection.release();
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
    });
  }
});

/**
 * 비번변경
 */
router.post('/password/reset', (req, res) => {
  const { pass: password, re_pass: passwordConfirmd, user_id: userId } = req.body;

  if (password !== passwordConfirmd || userId === '') {
    res.redirect('/process?url=administrator&msg=error');
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.ADMIN.ResetPassword,
        [bcrypt.hashSync(password, 10), userId],
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            res.redirect('/administrator');
          }
        }
      );
    });
  }
});

/**
 * 권한수정
 */
router.post('/role/reset', (req, res) => {
  const { authority: role, user_id: userId } = req.body;

  if (role === '' || userId === '') {
    res.redirect('/process?url=administrator&msg=error');
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.ADMIN.ResetRole,
        [role, userId],
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            res.redirect('/administrator');
          }
        }
      );
    });
  }
});

/**
 * 슈퍼바이저에게 지점을 배정한다.
 * 슈퍼바이저의 지점을 모두 삭제한 후 다시 넣는다.
 */
router.post('/assign/branch', (req, res) => {
  const { user_id: userId, branch_list: branchList } = req.body;

  if (!branchList.length) {
    res.redirect('/process?url=administrator&msg=error');
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
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
                  userId
                ],
                (err, data) => {
                  callback(err, data);
                }
              );
            },
            (callback) => {
              // 두 번째 쿼리
              connection.query(QUERY.ADMIN.InsertAdminBranch,
                [ branchList ],
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
                connection.release();
                res.json({
                  success: true
                });
              });
            }
          });
      });
    });
  }
});

/** 직원 비활성화 */
router.delete('/', util.isAuthenticated, (req, res, next) => {
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
