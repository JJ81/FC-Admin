const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const UserService = require('../service/UserService');
const util = require('../util/util');
const bcrypt = require('bcrypt');
const async = require('async');
const pool = require('../commons/db_conn_pool');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series([
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetEmployeeList, [req.user.fc_id], (err, employee) => {
          callback(err, employee);
        });
      },
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetBranch, [req.user.fc_id], (err, branch) => {
          callback(err, branch);
        });
      },
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetDuty, [req.user.fc_id], (err, duty) => {
          callback(err, duty);
        });
      }
    ],
    (err, results) => {
      connection.release();
      if (err) {
        console.error(err);
      } else {
        res.render('employee', {
          current_path: 'Employee',
          title: '직원관리',
          loggedIn: req.user,
          list: results[0],
          branch: results[1],
          duty: results[2]
        });
      }
    });
  });
});

/**
 * 유저 생성하기
 */
router.post('/create', util.isAuthenticated, (req, res, next) => {
  let _data = {
    name: req.body.name.trim(),
    branch_id: req.body.branch.trim(), // id
    duty_id: req.body.duty.trim(), // id
    tel: req.body.tel.trim(),
    email: req.body.email.trim(),
    pass: req.body.pass.trim(),
    re_pass: req.body.re_pass.trim(),
    fc_id: req.user.fc_id // id
  };

  if (_data.pass !== _data.re_pass ||
     !util.isValidPhone(_data.tel) ||
     !util.isValidEmail(_data.email === '' ? 'dummy@email.com' : _data.email) ||
     !util.checkPasswordSize(_data.pass, 4)) {
    return next({
      status: 500,
      message: '잘못된 형식의 휴대폰번호 사용자가 존재합니다.'
    });
  } else {
    _data.pass = bcrypt.hashSync(_data.pass, 10);

    pool.getConnection((err, connection) => {
      if (err) throw err;
      async.series([
        (callback) => {
          connection.query(QUERY.EMPLOYEE.GetActivatedUserByPhone,
            [_data.tel],
            (err, result) => {
              if (result.length > 0) {
                err = {
                  status: 500,
                  message: '중복된 휴대폰번호 사용자가 존재합니다.'
                };
              }
              callback(err, result);
            }
          );
        },
        (callback) => {
          connection.query(QUERY.EMPLOYEE.CreateEmployee, [
            _data.name,
            _data.pass,
            _data.email,
            _data.tel,
            _data.fc_id,
            _data.duty_id,
            _data.branch_id
          ],
          (err, result) => {
            callback(err, result);
          });
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          return next(err);
        } else {
          res.redirect('/employee');
        }
      });
    });
  }
});

/**
 * 유저 수정
 */
router.post('/modify', util.isAuthenticated, (req, res, next) => {
  let _data = {
    user_id: req.body.employee_id,
    name: req.body.name.trim(),
    branch_id: req.body.branch.trim(), // id
    duty_id: req.body.duty.trim(), // id
    tel: req.body.tel.trim(),
    email: req.body.email.trim(),
    fc_id: req.user.fc_id // id
  };

  if (!util.isValidPhone(_data.tel) ||
     !util.isValidEmail(_data.email === '' ? 'dummy@email.com' : _data.email) ||
     _data.branch_id === '' ||
     _data.duty_id === ''
  ) {
    return next({
      status: 500,
      message: '잘못된 형식의 휴대폰번호 사용자가 존재합니다.'
    });
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      async.series([
        (callback) => {
          connection.query(QUERY.EMPLOYEE.GetAnotherActivatedUserByPhone,
            [_data.user_id, _data.tel],
            (err, result) => {
              if (result.length > 0) {
                err = {
                  status: 500,
                  message: '중복된 휴대폰번호 사용자가 존재합니다.'
                };
              }
              callback(err, result);
            }
          );
        },
        (callback) => {
          connection.query(QUERY.EMPLOYEE.ModifyEmployee, [
            _data.name,
            _data.email,
            _data.tel,
            _data.branch_id,
            _data.duty_id,
            _data.user_id,
            _data.fc_id
          ],
          (err, result) => {
            callback(err, result);
          });
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          return next(err);
        } else {
          res.redirect('/employee');
        }
      });
    });
  }
});

/**
 * 지점 생성
 */
router.post('/create/branch', (req, res, next) => {
  const _name = req.body.name.trim();

  if (_name === null || _name === '') {
    // res.redirect('/process?url=employee&msg=error');
    return next({
      status: 500,
      message: '필수입력값 누락'
    });
  } else {
    // todo 동일한 fc에서의 지점이 중복인지 여부를 검사해야 한다
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.EMPLOYEE.CreateBranch,
        [_name, req.user.fc_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error(err);
            return next({
              status: 500,
              message: '중복되는 지점명입니다.'
            });
          } else {
            res.redirect('/employee');
          }
        }
      );
    });
  }
});

/**
 * 지점 수정하기
 */
router.post('/modify/branch', (req, res, next) => {
  const _name = req.body.name.trim();

  if (_name === null || _name === '') {
    return next({
      status: 500,
      message: '필수입력값 누락'
    });
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.EMPLOYEE.ModifyBranch,
        [
          _name, req.body.id
        ],
        (err, result) => {
          connection.release();
          if (err) {
            console.error(err);
            return next({
              status: 500,
              message: '중복되는 지점명입니다.'
            });
          } else {
            res.redirect('/employee');
          }
        }
      );
    });
  }
});

/**
 * 직책 생성
 */
router.post('/create/duty', (req, res, next) => {
  const _name = req.body.name.trim();

  if (_name === null || _name === '') {
    return next({
      status: 500,
      message: '필수입력값 누락'
    });
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.EMPLOYEE.CreateDuty,
        [ _name, req.user.fc_id ],
        (err, result) => {
          if (err) {
            console.error(err);
            return next({
              status: 500,
              message: '중복되는 직책명입니다.'
            });
          } else {
            res.redirect('/employee');
          }
        }
      );
    });
  }
});

/**
 * 직책 수정하기
 */
router.post('/modify/duty', (req, res, next) => {
  const _name = req.body.name.trim();
  if (_name === null || _name === '') {
    return next({
      status: 500,
      message: '필수입력값 누락'
    });
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.EMPLOYEE.ModifyDuty,
        [ _name, req.body.id ],
        (err, result) => {
          if (err) {
            console.error(err);
            return next({
              status: 500,
              message: '중복되는 직책명입니다.'
            });
          } else {
            res.redirect('/employee');
          }
        }
      );
    });
  }
});

/**
 * 암호 재설정
 */
router.post('/password/reset', util.isAuthenticated, (req, res, next) => {
  const {
    pass: password,
    re_pass: passwordConfirmd,
    user_id: userId,
    user_name: userName
  } = req.body;

  if (password !== passwordConfirmd || userId === '' || userName === '') {
    res.redirect('/process?url=employee&msg=error');
  } else {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(QUERY.EMPLOYEE.ResetPassword,
        [bcrypt.hashSync(password, 10), userId, userName],
        (err, result) => {
          connection.release();
          if (err) {
            console.error(err);
          } else {
            res.redirect('/employee');
          }
        }
      );
    });
  }
});

/** 직원 비활성화 */
router.delete('/', util.isAuthenticated, (req, res, next) => {
  UserService.deactivateEmployeeById(req.query.id,
    (err, data) => {
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

/** 지점 비활성화 */
router.delete('/branch', util.isAuthenticated, (req, res, next) => {
  UserService.deactivateBranchById(req.query.id,
    (err, data) => {
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

/** 직책 비활성화 */
router.delete('/duty', util.isAuthenticated, (req, res, next) => {
  UserService.deactivateDutyById(req.query.id,
    (err, data) => {
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
