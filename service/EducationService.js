/**
 * Created by yijaejun on 03/01/2017.
 */
// const mysql_dbc = require('../commons/db_conn')();
// const connection = mysql_dbc.init();
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');
var async = require('async');
const AssignmentService = require('../service/AssignmentService');
var EducationService = {};
const util = require('../util/util');

EducationService.deactivateById = function (_id, _callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(QUERY.EDU.DisableEduById, [_id], function (err, data) {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * todo
 * 순서를 받아야 한다.
 */
EducationService.addCourseList = function (group_id, course_list, cb) {
  var _count_info = 0;
  var _count_size = 0;
  var _error = [];

  if (_count_info === 0) {
    _count_size = course_list.length;
  }

  connection.query(QUERY.EDU.InsertCourseGroup, [
    group_id,
    course_list[_count_info],
    0
  ],
    function (err, result) {
      if (err) {
        console.error('EducationService:addCourseList ' + err);
        _error.push(err);
        callback(err, null);
      }

      if (_count_info < _count_size - 1) {
        _count_info++;
        EducationService.addCourseList(group_id, course_list, cb);
      } else {
        // result를 모아서 던질 수 있어야 하나?
        // todo 마지막 result를 던지지 말고 모든 result를 담아서 객체를 던지든가 아니면 true값만 던진다.
        cb(null, result);
      }
    }
  );
};

/**
 * 강의그룹을 입력/수정한다.
 */
EducationService.InsertOrUpdateCourseGroup = function (connection, data, callback) {
  EducationService.connection = connection;
  async.each(data, executeCourseGroup, function (err, data) {
    callback(err, data);
  });
};

/**
 * 강의그룹을 입력/수정/삭제한다.
 *
 * @param {json} data
 * @param {function} callback
 */
function executeCourseGroup (data, callback) {
  var _query = null;

  if (data.mode === 'DELETE') {
    _query =
      EducationService.connection.query(QUERY.EDU.DeleteCourseGroup, [
        data.id
      ],
        function (err, data) {
          console.log(_query.sql);
          callback(err, data);
        }
      );
  } else if (data.mode === 'UPDATE') {
    _query =
      EducationService.connection.query(QUERY.EDU.UpdateCourseGroup, [
        data.order,
        data.id
      ],
        function (err, data) {
          console.log(_query.sql);
          callback(err, data);
        }
      );
  } else if (data.mode === 'INSERT') {
    _query =
      EducationService.connection.query(QUERY.EDU.InsertCourseGroup, [
        data.course_group_id,
        data.course_id,
        data.order
      ],
        function (err, data) {
          console.log(_query.sql);
          callback(err, data);
        }
      );
  }
}

EducationService.create = (req, res, next) => {
  let eduId;
  let trainingEduId;
  let courseGroupId = util.publishHashByMD5(new Date());

  if (req.body.training_edu_id !== undefined) {
    trainingEduId = req.body.training_edu_id;
  }

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.beginTransaction(() => {
      async.series(
        [
          // 교육과정을 수정/입력한다.
          callback => {
            if (req.body.edu_id) {
              console.log('//// 교육과정 수정 ////');
              eduId = req.body.edu_id;
              connection.query(QUERY.EDU.UpdateEdu,
                [
                  req.body.name,
                  req.body.desc,
                  req.body.edu_id
                ],
                (err, result) => {
                  callback(err, result);
                }
              );
            } else {
              console.log('//// 교육과정 입력 ////');
              connection.query(QUERY.EDU.InsertEdu,
                [
                  req.body.name,
                  req.body.desc,
                  courseGroupId,
                  req.user.admin_id
                ],
                (err, result) => {
                  eduId = result.insertId;
                  callback(err, result);
                }
              );
            }
          },
          // 기존 교육생 배정내역을 삭제한다.
          // callback => {
          //   if (trainingEduId !== undefined) {
          //     console.log('//// 교육생 배정내역 삭제 ////');
          //     AssignmentService.deleteAllocation(connection, {
          //       trainingEduId: req.body.training_edu_id,
          //       assignmentId: parseInt(req.body.assigment_id)
          //     },
          //     (err, data) => {
          //       callback(err, null);
          //     });
          //   } else {
          //     callback(null, null);
          //   }
          // },
          // 교육생 배정내역을 생성한다.
          callback => {
            console.log('//// 교육생 배정내역 생성 ////');
            AssignmentService.allocate(connection, {
              edu_id: eduId,
              log_bind_user_id: parseInt(req.body.log_bind_user_id),
              start_dt: req.body.start_dt,
              end_dt: req.body.finish_dt,
              user: req.user
            }, (err, data) => {
              trainingEduId = data.trainingEduId;
              callback(err, null);
            });
          },
          // 간편 배정내역을 수정한다.
          callback => {
            if (req.body.assigment_id !== undefined) {
              console.log('//// 간편배정내역 수정 ////');
              AssignmentService.updateSimpleAssignment({
                id: parseInt(req.body.assigment_id),
                eduId: eduId,
                trainingEduId: trainingEduId,
                step: 3
              }, function () {
                callback(null, null);
              });
            } else {
              callback(null, null);
            }
          },
          // 포인트 저장
          callback => {
            console.log('//// 포인트 정보 입력 ////');
            connection.query(QUERY.EDU.SetPointWeight,
              [
                req.body.complete_point,
                req.body.quiz_point,
                req.body.test_point,
                req.body.reeltime_point,
                req.body.speed_point,
                req.body.reps_point,
                req.user.admin_id,
                eduId,
                req.user.fc_id
              ],
              (err, result) => {
                callback(err, result);
              }
            );
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
                return res.send({
                  success: true,
                  trainingEduId: trainingEduId,
                  courseGroupId: courseGroupId
                });
              }
            });
          }
        }
      );
    });
  });
};

EducationService.getCourseList = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        // 교육과정의 강의목록을 조회한다.
        (callback) => {
          connection.query(QUERY.EDU.GetCourseListByEduId, [ req.params.id ], (err, data) => {
            callback(err, data);
          });
        }
        // 전체 강의목록을 조회한다.
        // (callback) => {
        //   connection.query(QUERY.EDU.GetCourseList, [ req.user.fc_id ], (err, data) => {
        //     callback(err, data);
        //   });
        // }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          console.error(err);
        } else {
          res.send({
            edu_course_list: results[0]
          });
        }
      }
    );
  });
};

module.exports = EducationService;
