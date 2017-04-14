const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const async = require('async');
const EducationService = require('../service/EducationService');
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');

/**
 * 교육과정괸리 첫페이지
 */
router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        (callback) => {
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
          connection.query(QUERY.EDU.GetCourseList, [req.user.fc_id], (err, rows) => {
            if (err) {
              console.error(err);
              callback(err, null);
            } else {
              callback(null, rows);
            }
          });
        }
      ],
    (err, result) => {
      connection.release();
      if (err) {
        console.error(err);
      } else {
        res.render('education', {
          current_path: 'Education',
          menu_group: 'education',
          title: '교육과정 등록',
          loggedIn: req.user,
          list: result[0],
          course_list: result[1]
        });
      }
    });
  });
});

/**
 * 교육과정관리 상세페이지
 */
router.get('/details', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  const _params = req.query;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
      // 교육과정정보를 조회한다.
      // results[0]
        (callback) => {
          connection.query(QUERY.EDU.GetEduInfoById, [ _params.id ], (err, data) => {
            callback(err, data);
          });
        },
        // 교육과정의 강의목록을 조회한다.
        // results[1]:
        (callback) => {
          connection.query(QUERY.EDU.GetCourseListByGroupId, [ _params.course_group_id ], (err, data) => {
            callback(err, data);
          });
        },
        // 전체 강의목록을 조회한다.
        // results[2]
        (callback) => {
          connection.query(QUERY.EDU.GetCourseList, [ req.user.fc_id ], (err, data) => {
            callback(err, data);
          });
        },
        // 교육과정 포인트 설정값 조회
        // result[3]
        (callback) => {
          connection.query(QUERY.EDU.GetRecentPointWeight,
            [
              req.user.fc_id, _params.id
            ],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                let pointweight = rows[0];
                if (pointweight != null) { callback(null, rows); } else {
                  callback(null, [{
                    point_complete: 0,
                    point_quiz: 0,
                    point_final: 0,
                    point_reeltime: 0,
                    point_speed: 0,
                    point_repetition: 0
                  }]);
                }
              }
            }
          );
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          console.error(err);
        } else {
          res.render('education_details', {
            current_path: 'EducationDetails',
            menu_group: 'education',
            title: '교육과정상세',
            loggedIn: req.user,
            edu: results[0][0],
            edu_course_list: results[1],
            course_list: results[2],
            point_weight: results[3]
          });
        }
      }
    );
  });
});

/**
 * 교육과정을 등록한다.
 */
router.post('/create/edu', util.isAuthenticated, (req, res, next) => {
  const _inputs = req.body;
  let courseGroupId = null;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.beginTransaction(() => {
      async.series(
        [
          // course_group_id 생성
          (callback) => {
            courseGroupId = util.publishHashByMD5(new Date());
            callback(null, null);
          },
          // 교육과정 생성
          (callback) => {
            connection.query(QUERY.EDU.InsertEdu,
              [
                _inputs.name,
                _inputs.desc,
                courseGroupId,
                req.user.admin_id
                // _inputs.start_dt,
                // _inputs.end_dt
              ],
              (err, result) => {
                callback(err, result);
              }
            );
          },
          // 강의그룹을 입력/수정한다.
          (callback) => {
            for (let index = 0; index < _inputs.course_group_list.length; index++) {
              _inputs.course_group_list[index].course_group_id = courseGroupId;
            }
            EducationService.InsertOrUpdateCourseGroup(connection, _inputs.course_group_list,
              (err, result) => {
                callback(err, result);
              }
            );
          }
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            connection.rollback();
            res.json({
              success: false
            });
          } else {
            connection.release();
            connection.commit();
            res.json({
              success: true
            });
          }
        });
    });
  });
});

/**
 * 교육과정을 수정한다.
 */
router.put('/modify/edu', util.isAuthenticated, (req, res, next) => {
  const _inputs = req.body;
  let _query = null;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.beginTransaction(() => {
      async.series(
        [
          // 교육과정을 수정한다.
          (callback) => {
            _query = connection.query(QUERY.EDU.UpdateEdu, [
              _inputs.name,
              _inputs.desc,
              _inputs.start_dt,
              _inputs.end_dt,
              _inputs.id
            ],
            (err, result) => {
              console.log(_query.sql);
              callback(err, result);
            });
          },

          // 강의그룹을 입력/수정한다.
          (callback) => {
            console.log(_inputs.course_group_list);
            EducationService.InsertOrUpdateCourseGroup(connection, _inputs.course_group_list,
              (err, result) => {
                callback(err, result);
              }
            );
          }
        ],
        (err, result) => {
          connection.release();
          if (err) {
            console.error(err);
            connection.rollback();
            return res.json({
              success: false
            });
          } else {
            connection.commit();
            return res.json({
              success: true
            });
          }
        }
      );
    });
  });
});

/**
 * 강의순서 변경
 */
router.put('/coursegroup', util.isAuthenticated, (req, res, next) => {
  const _inputs = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.EDU.UpdateCourseGroup,
      [
        _inputs.order,
        _inputs.id
      ],
      (err, data) => {
        if (err) {
          return res.json({
            success: false,
            msg: err
          });
        } else {
          return res.json({
            success: true
          });
        }
      }
    );
  });
});

/**
 * 강의를 그룹에서 삭제한다.
 */
router.delete('/course', util.isAuthenticated, (req, res, next) => {
  const _params = req.query;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.EDU.DeleteCourseGroupById, [_params.course_group_id], (err, data) => {
      connection.release();
      if (err) {
        res.json({ success: false, msg: err });
      } else {
        res.json({ success: true });
      }
    });
  });
});

/**
 * 교육과정별 포인트 설정
 */
router.post('/pointweight', util.isAuthenticated, (req, res, next) => {
  const {
    complete: eduComplete,
    quiz: quizComplete,
    final_test: finalComplete,
    reeltime: reeltimeComplete,
    speed: speedComplete,
    reps: repsComplete,
    course_group_id: courseGroupId,
    edu_id: eduId
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.EDU.SetPointWeight,
      [
        eduComplete,
        quizComplete,
        finalComplete,
        reeltimeComplete,
        speedComplete,
        repsComplete,
        req.user.admin_id,
        eduId,
        req.user.fc_id
      ],
      (err, result) => {
        connection.release();
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          res.redirect('/education/details?id=' + eduId + '&course_group_id=' + courseGroupId);
        }
      }
    );
  });
});

/** 교육과정 비활성화 */
router.delete('/deactivate', util.isAuthenticated, (req, res, next) => {
  EducationService.deactivateById(req.query.edu_id, (err, data) => {
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
