const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const async = require('async');
const formidable = require('formidable');
const util = require('../util/util');
const Excel = require('exceljs');
const convertExcel = require('excel-as-json').processFile;
const AssignmentService = require('../service/AssignmentService');
const pool = require('../commons/db_conn_pool');
const path = require('path');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series([
      // 교육대상 그룹
      // results[0]
      (callback) => {
        connection.query(QUERY.EDU.GetCustomUserList,
          [req.user.fc_id],
          (err, data) => {
            callback(err, data);
          });
      },
      // 직원 리스트
      // results[1]
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetEmployeeList,
          [req.user.fc_id],
          (err, data) => {
            callback(err, data);
          });
      }
    ],
    (err, results) => {
      connection.release();
      if (err) {
        console.error(err);
      } else {
        res.render('assignment', {
          current_path: 'Assignment',
          menu_group: 'education',
          title: '교육생 그룹생성',
          loggedIn: req.user,
          list: results[0],
          employees: results[1]
        });
      }
    });
  });
});

/**
 * 교육
 */
router.get('/details', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  var logBindUserId = req.query.id;
  var _group = req.query.group_id;

  pool.getConnection((err, connection) => {
    if (err) throw err;

    async.series(
      [
        (callback) => {
          // 교육배정 내역
          connection.query(QUERY.EDU.GetAssignmentDataById, [logBindUserId], (err, rows) => {
            if (err) {
              console.error(err);
              callback(err, null);
            } else {
              callback(null, rows);
            }
          });
        },
        (callback) => {
          // 교육배정자 목록
          connection.query(QUERY.EDU.GetUserListByGroupId, [_group], (err, rows) => {
            if (err) {
              console.error(err);
              callback(err, null);
            } else {
              callback(null, rows);
            }
          });
        },
        (callback) => {
          // 교육과정 리스트
          connection.query(QUERY.EDU.GetList, [req.user.fc_id], (err, rows) => {
            if (err) {
              console.error(err);
              callback(err, null);
            } else {
              callback(null, rows);
            }
          });
        },
        (callback) => {
          // 교육배정이력
          connection.query(QUERY.HISTORY.GetAssignEduHistoryById,
            [req.user.fc_id, logBindUserId],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                callback(null, rows);
              }
            }
          );
        },
        // 직원목록
        (callback) => {
          connection.query(QUERY.EMPLOYEE.GetEmployeeList,
            [req.user.fc_id],
            (err, data) => {
              callback(err, data);
            }
          );
        },
        // 이번 달 교육 진척도
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetThisMonthProgressByEdu,
            [ req.user.fc_id ],
            (err, data) => {
              callback(err, data);
            }
          );
        }
      ],
      (err, result) => {
        connection.release();

        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          res.render('assignment_details', {
            current_path: 'AssignmentDetails',
            menu_group: 'education',
            title: '교육생 그룹 상세',
            loggedIn: req.user,
            detail: result[0],
            detail_list: result[1],
            edu_list: result[2],
            assignmentHistory: result[3],
            employees: result[4],
            edu_progress: result[5]
          });
        }
      });
  });
});

/**
 * 교육과정별 포인트 현황을 반환한다.
 */
router.get('/employees', util.isAuthenticated, (req, res) => {
  const { edu_id: eduId } = req.query;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        (callback) => {
          connection.query(QUERY.EDU.GetUserByEduId,
            [
              req.user.fc_id,
              eduId
            ],
            (err, rows) => {
              console.log(rows);
              callback(err, rows);
            }
          );
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          return res.json({
            success: false,
            data: err
          });
        } else {
          return res.json({
            success: true,
            data: results[0]
          });
        }
      });
  });
});

/**
 * 특정 교육생그룹에 교육과정을 배정한다.
 */
router.post('/allocation/edu', (req, res, next) => {
  const requestData = {
    edu_id: req.body.edu_list,
    log_bind_user_id: req.body.bind_group_id,
    log_bind_user_group_id: req.body.group_id,
    start_dt: req.body.start_dt,
    end_dt: req.body.end_dt,
    user: req.user
  };

  pool.getConnection((err, connection) => {
    if (err) throw err;
    // 교육과정 배정을 위한 서비스 호출
    AssignmentService.allocate(connection, requestData, (err, data) => {
      connection.release();
      if (err) {
        console.log(err);
        res.json({
          success: false,
          msg: err
        });
      } else {
        res.redirect('/assignment/details?id=' + requestData.log_bind_user_id + '&group_id=' + requestData.log_bind_user_group_id);
      }
    });
  });
});

router.post('/modify', (req, res, next) => {
  const requestData = {
    log_bind_user_id: req.body.bind_group_id,
    log_bind_user_group_id: req.body.group_id,
    log_assign_edu_id: req.body.log_assign_edu_id,
    start_dt: req.body.start_dt,
    end_dt: req.body.end_dt
  };
  AssignmentService.modifyLogAssignEdu(requestData, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.redirect('/assignment/details?id=' + requestData.log_bind_user_id + '&group_id=' + requestData.log_bind_user_group_id);
    }
  });
});

/**
 * 교육배정자 그룹을 저장한다.
 * 방식(2)
 * 1. employee : 직원목록을 이용하여 생성
 * 2. excel : 엑셀 업로드를 이용하여 생성
 */
router.post('/upload', util.isAuthenticated, (req, res, next) => {
  const incomingForm = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: path.join(__dirname, '/../public/uploads/excel')
  });

  incomingForm.on('error', function (err) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
  });

  incomingForm.parse(req, (err, fields, files) => {
    if (err) throw err;
    const uploadType = fields.upload_type;
    let filePath;
    let logBindUserId;
    let employeeIds;
    let requestData = {
      admin_id: req.user.admin_id,
      upload_type: fields.upload_type,
      upload_employee_ids: JSON.parse('[' + fields.upload_employee_ids + ']'),
      group_name: fields.group_name,
      group_desc: fields.group_desc,
      redirect: fields.redirect ? fields.redirect : true,
      simple_assignment_id: fields.id
    };

    pool.getConnection((err, connection) => {
      if (err) throw err;
      async.series(
        [
          // 엑셀 데이터를 읽어들인다.
          (callback) => {
            switch (uploadType) {
            case 'excel':
              filePath = files['file-excel'].path;

              const wb = new Excel.Workbook();
              wb.xlsx.readFile(filePath)
              .then(() => {
                let ws = wb.getWorksheet(1);
                let phone = [];
                ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                  row.eachCell((cell, colNumber) => {
                    if (rowNumber >= 2 && colNumber === 2) {
                      phone.push(cell.value);
                    }
                    // console.log('Row ' + rowNumber + ', Cell ' + colNumber + ' = ' + cell.value);
                  });
                });
                requestData.excel = phone;
                callback(null, requestData);
              });
              break;

            case 'employee':
              callback(null, null);
              break;

            default:
              break;
            }
          },
          // 간편배정 시 이전 교육배정 그룹을 삭제한다.
          // (callback) => {
          //   if (requestData.simple_assignment_id !== undefined) {
          //     AssignmentService.deleteAssignment({
          //       id: parseInt(requestData.simple_assignment_id)
          //     }, function () {
          //       callback(null, null);
          //     });
          //   } else {
          //     callback(null, null);
          //   }
          // },
          // 교육배정 그룹을 생성한다.
          (callback) => {
            AssignmentService.create(connection, requestData, (err, result) => {
              if (result.insertId) {
                logBindUserId = result.insertId;
              }
              if (result.employeeIds) {
                employeeIds = result.employeeIds.join(',');
              }
              callback(err, result);
            });
          },
          // 간편배정내역을 수정한다.
          (callback) => {
            if (requestData.simple_assignment_id !== undefined && logBindUserId !== undefined) {
              AssignmentService.updateSimpleAssignment({
                id: parseInt(requestData.simple_assignment_id),
                logBindUserId: logBindUserId,
                step: 2
              }, function () {
                callback(null, null);
              });
            } else {
              callback(null, null);
            }
          },
          // 엑셀파일을 삭제한다.
          (callback) => {
            if (requestData.upload_type === 'excel') {
              util.deleteFile(filePath, (err, result) => {
                if (err) {
                  console.error(err);
                  callback(err, null);
                } else {
                  callback(null, result);
                }
              });
            } else {
              callback(null, null);
            }
          }
        ],
        (err, results) => {
          connection.release();
          if (err) {
            console.error(err);
            throw new Error('err');
          }

          if (requestData.redirect === undefined) {
            res.redirect('/assignment');
          } else {
            res.send({
              success: true,
              employeeIds: employeeIds,
              logBindUserId: logBindUserId
            });
          }
        }
      );
    });
  });
});

/**
 * 교육생그룹 삭제
 */
router.delete('/', util.isAuthenticated, (req, res, next) => {
  const queryParams = req.query;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.beginTransaction((err) => {
      // 트렌젝션 오류 발생
      if (err) {
        res.json({
          success: false,
          msg: err
        });
      }
      async.series(
        [
          // log_bind_users 삭제
          (callback) => {
            connection.query(QUERY.ASSIGNMENT.DisableLogBindUserById,
              [ queryParams.id ],
              function (err, data) {
                callback(err, data);
              }
            );
          }
        ],
        (err, results) => {
          if (err) {
            // 쿼리 오류 발생
            return connection.rollback(() => {
              return res.json({
                success: false,
                msg: err
              });
            });
          } else {
            connection.commit((err) => {
              // 커밋 오류 발생
              if (err) {
                return connection.rollback(() => {
                  return res.json({
                    success: false,
                    msg: err
                  });
                });
              }
              // 커밋 성공
              connection.release();
              res.json({
                success: true
              });
            });
          }
        }
      );
    });
  });
});

module.exports = router;
