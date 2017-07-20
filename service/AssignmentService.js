
const QUERY = require('../database/query');
const async = require('async');
const Util = require('../util/util');
const AssignmentService = {};
const pool = require('../commons/db_conn_pool');

/**
 * 관리자를 비활성화 한다.
 * _id: users 테이블의 id
 */
AssignmentService.deactivateEduAssignmentById = (_id, _callback) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.ASSIGNMENT.DisableLogAssignEduById, [_id], (err, data) => {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * log_assign_edu 의 start_dt, end_dt 를 수정한다.
 */
AssignmentService.modifyLogAssignEdu = (_data, _callback) => {
  const logAssignEduId = _data.log_assign_edu_id;
  const trainingStartDate = _data.start_dt + ' ' + '00:00:00';
  const trainingEndDate = _data.end_dt + ' ' + '23:59:59';

  pool.getConnection((err, connection) => {
    if (err) throw err;
    let q = connection.query(QUERY.ASSIGNMENT.UpdateLogAssignEduById,
      [trainingStartDate, trainingEndDate, logAssignEduId],
      (err, data) => {
        console.log(q.sql);
        connection.release();
        if (err) throw err;
        _callback(err, data);
      }
    );
  });
};

/**
 * _data.upload_type 이 'excel' 일 경우
 * user 를 먼저 생성한다음 user_id를 취득한 후 아래 단계를 진행한다.
 *
 * 1. log_group_user 생성
 * 2. log_bind_users 생성
 */
AssignmentService.create = (_connection, _data, _callback) => {
  let userIdCount = 0;
  let simpleAssignmentId = _data.simple_assignment_id;
  const logGroupUserId = Util.publishHashByMD5(new Date());
  let userIds = [];

  _connection.beginTransaction((err) => {
    // 트렌젝션 오류 발생
    if (err) _callback(err, null);

    switch (_data.upload_type) {
    case 'excel':
      // 핸드폰 번호로 사용자를 검색한다.
      _connection.query(QUERY.EDU.GetUserDataByPhone, [ _data.excel ], (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
          _callback(null, null);
          return;
        }
        for (var index = 0; index < data.length; index++) {
          userIds.push(data[index].id);
        }
        async.whilst(
          () => {
            return userIdCount < userIds.length;
          },
          (callback) => {
            // log_group_user 테이블에 차례대로 입력
            _connection.query(QUERY.EDU.InsertIntoLogGroupUser,
              [ userIds[userIdCount], logGroupUserId ],
              (err, data) => {
                callback(err, null);
              }
            );
            userIdCount++;
          },
          (err, data) => {
            if (err) {
              console.log('----------------------------');
              console.log('error:InsertIntoLogGroupUser');
              console.error(err);
              return _connection.rollback(() => {
                _callback(err, null);
                return;
              });
            }

            // log_bind_users 테이블에 입력
            _connection.query(QUERY.EDU.InsertIntoLogBindUser,
              [
                _data.group_name,
                _data.group_desc,
                _data.admin_id,
                logGroupUserId
              ],
              (err, result) => {
                if (err) {
                  console.log('----------------------------');
                  console.log('error:InsertIntoLogBindUser');
                  console.error(err);
                  return _connection.rollback(() => {
                    _callback(err, null);
                    return;
                  });
                } else {
                  _connection.commit((err) => {
                    if (err) {
                      return _connection.rollback(() => {
                        _callback(err, null);
                        return;
                      });
                    } else {
                      console.log('commit success!');
                      _callback(null, { insertId: result.insertId, employeeIds: userIds });
                    }
                  });
                }
              });
          }
        );
      });
      break;

    case 'employee':
      if (_data.upload_employee_ids.length === 0) {
        _callback(null, null);
        return;
      }

      userIds = _data.upload_employee_ids.slice(0);

      async.whilst(
        () => {
          return userIdCount < userIds.length;
        },
        (callback) => {
          _connection.query(QUERY.EDU.InsertIntoLogGroupUser,
            [ userIds[userIdCount], logGroupUserId ],
            (err, data) => {
              callback(err, null);
            }
          );
          userIdCount++;
        },
        (err, data) => {
          if (err) {
            console.log('----------------------------');
            console.log('error:InsertIntoLogGroupUser');
            console.error(err);
            return _connection.rollback(() => {
              _callback(err, null);
              return;
            });
          }
          _connection.query(QUERY.EDU.InsertIntoLogBindUser,
            [
              _data.group_name,
              _data.group_desc,
              _data.admin_id,
              logGroupUserId,
              simpleAssignmentId
            ],
            (err, result) => {
              if (err) {
                console.log('----------------------------');
                console.log('error:InsertIntoLogBindUser');
                console.error(err);
                return _connection.rollback(() => {
                  _callback(err, null);
                  return;
                });
              } else {
                _connection.commit((err) => {
                  if (err) {
                    return _connection.rollback(() => {
                      _callback(err, null);
                      return;
                    });
                  } else {
                    console.log('commit success!');
                    _callback(null, result);
                  }
                });
              }
            }
          );
        }
      );
      break;

    default:
      break;
    }
  });
};

/**
 * 교육생그룹에 교육과정을 할당한다.
 */
AssignmentService.allocate = (_connection, _data, _callback) => {
  const eduId = _data.edu_id;
  const logBindUserId = _data.log_bind_user_id;
  const trainingStartDate = _data.start_dt;
  const trainingEndDate = _data.end_dt;
  const userData = _data.user;
  let trainingEduId = null;

  async.series([
    callback => {
      // training_edu 테이블에 입력
      _connection.query(QUERY.EDU.InsertTrainingEdu,
        [ eduId, userData.admin_id ],
        (err, data) => {
          if (!err) {
            trainingEduId = data.insertId;
          }
          callback(err, data);
        }
      );
    },
    callback => {
      // training_user 테이블에 입력
      _connection.query(QUERY.EDU.InsertUserIdInTrainingUsers,
        [
          trainingEduId,
          logBindUserId
        ],
        (err, data) => {
          callback(err, data);
        }
      );
    },
    callback => {
      // log_assign_edu 테이블에 입력
      _connection.query(QUERY.HISTORY.InsertIntoLogAssignEdu,
        [
          trainingEduId,
          logBindUserId,
          userData.admin_id,
          trainingStartDate + ' ' + '00:00:00',
          trainingEndDate + ' ' + '23:59:59'
        ],
        (err, data) => {
          callback(err, data);
        }
      );
    }
  ],
  (err, results) => {
    if (err) {
      throw err;
    } else {
      _callback(null, { trainingEduId: trainingEduId });
    }
  });
};

AssignmentService.deleteAllocation = (_connection, { trainingEduId, assignmentId }, _callback) => {
  async.series(
    [
      callback => {
        _connection.query(QUERY.ASSIGNMENT.DeleteTrainingUsersByTrainingEduId,
          [ trainingEduId ],
          (err, rows) => {
            callback(err, rows);
          });
      },
      callback => {
        _connection.query(QUERY.ASSIGNMENT.DeleteLogAssignEduByTrainingEduId,
          [ trainingEduId ],
          (err, rows) => {
            callback(err, rows);
          });
      },
      callback => {
        AssignmentService.deleteAssignment({ id: assignmentId },
          (err, result) => {
            callback(err, null);
          }
        );
      },
      callback => {
        _connection.query(QUERY.ASSIGNMENT.DeleteTrainingEduById,
          [ trainingEduId ],
          (err, rows) => {
            callback(err, rows);
          });
      }
    ],
    (err, results) => {
      if (err) {
        throw err;
      } else {
        _callback(null, null);
      }
    }
  );
};

AssignmentService.getSimpleAssignmentList = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        (callback) => {
          connection.query(QUERY.ASSIGNMENT.SelectSimpleAssignments,
            [ req.user.fc_id ],
            (err, rows) => {
              if (err) {
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          console.log(results[0]);
          return res.render('simple-assignment', {
            title: '교육 간편배정',
            current_path: 'SimpleAssignment',
            menu_group: 'education',
            loggedIn: req.user,
            list: results[0]
          });
        }
      }
    );
  });
};

AssignmentService.getSimpleAssignmentById = (req, res, next, id) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.ASSIGNMENT.SelectSimpleAssignmentById,
      [ id ],
      (err, result) => {
        connection.release();
        if (err) {
          throw new Error(err);
        } else if (!result) {
          return res.sendStatus(400);
        } else {
          req.assignment = result[0];
          return next();
        }
      });
  });
};

AssignmentService.createSimpleAssignment = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.beginTransaction(err => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      }

      async.series(
        [
          (callback) => {
            connection.query(QUERY.ASSIGNMENT.InsertSimpleAssignment,
              [req.user.admin_id],
              (err, rows) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, rows);
                }
              });
          }
        ],
        (err, results) => {
          connection.release();
          if (err) {
            connection.rollback(() => {
              return res.status(500).send({
                success: false,
                message: err
              });
            });
          } else {
            connection.commit((err) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: err
                });
              } else {
                // success code
                return res.redirect(`/simple_assignment/${results[0].insertId}`);
              }
            });
          }
        }
      );
    });
  });
};

// 간편배정 내역을 삭제한다.
AssignmentService.deleteSimpleAssignment = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.beginTransaction(err => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      }

      async.series(
        [
          (callback) => {
            connection.query(QUERY.ASSIGNMENT.DeleteSimpleAssignment,
              [req.query.id],
              (err, rows) => {
                callback(err, rows);
              });
          }
        ],
        (err, results) => {
          connection.release();
          if (err) {
            connection.rollback(() => {
              return res.status(500).send({
                success: false,
                message: err
              });
            });
          } else {
            connection.commit((err) => {
              if (err) {
                return res.status(500).send({
                  success: false,
                  message: err
                });
              } else {
                return res.status(200).send({
                  success: true
                });
              }
            });
          }
        }
      );
    });
  });
};

// 간편배정 진행상태를 저장한다.
AssignmentService.updateSimpleAssignment = (data, _callback) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.beginTransaction(err => {
      if (err) throw err;

      async.series(
        [
          (callback) => {
            connection.query(QUERY.ASSIGNMENT.UpdateSimpleAssignment(data),
              [],
              (err, rows) => {
                callback(err, rows);
              });
          }
        ],
        (err, results) => {
          connection.release();
          if (err) {
            connection.rollback(() => {
              throw err;
            });
          } else {
            connection.commit((err) => {
              if (err) {
                throw err;
              } else {
                _callback();
              }
            });
          }
        }
      );
    });
  });
};

AssignmentService.deleteAssignment = (data, _callback) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.beginTransaction(err => {
      if (err) throw err;

      async.series(
        [
          (callback) => {
            connection.query(QUERY.ASSIGNMENT.DeleteGroupUserBySimpleAssignId(data),
              [],
              (err, rows) => {
                callback(err, rows);
              });
          },
          (callback) => {
            connection.query(QUERY.ASSIGNMENT.DeleteBindUserBySimpleAssignId(data),
              [],
              (err, rows) => {
                callback(err, rows);
              });
          }
        ],
        (err, results) => {
          connection.release();
          if (err) {
            connection.rollback(() => {
              throw err;
            });
          } else {
            connection.commit((err) => {
              if (err) {
                throw err;
              } else {
                _callback();
              }
            });
          }
        }
      );
    });
  });
};

module.exports = AssignmentService;
