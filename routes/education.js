const express = require('express');
const router = express.Router();
const mySqlDbc = require('../commons/db_conn')();
const connection = mySqlDbc.init();
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
const async = require('async');
const EducationService = require('../service/EducationService');
const util = require('../util/util');

/**
 * 교육과정괸리 첫페이지
 */
router.get('/', isAuthenticated, (req, res) => {
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
    if (err) {
      console.error(err);
    } else {
      res.render('education', {
        current_path: 'Education',
        menu_group: 'education',
        title: global.PROJ_TITLE + 'Education',
        loggedIn: req.user,
        list: result[0],
        course_list: result[1]
      });
    }
  });
});

/**
 * 교육과정관리 상세페이지
 */
router.get('/details', isAuthenticated, (req, res) => {
  const _params = req.query;

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
              _point_weight = rows[0];
              if (_point_weight != null) { callback(null, rows); } else {
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
      if (err) {
        console.error(err);
      } else {
        res.render('education_details', {
          current_path: 'EducationDetails',
          menu_group: 'education',
          title: PROJ_TITLE + 'Education Details',
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

/**
 * 교육과정을 등록한다.
 */
router.post('/create/edu', isAuthenticated, (req, res) => {
  const _inputs = req.body;
  let _course_group_id = null;

  connection.beginTransaction(() => {
    async.series(
      [
        // course_group_id 생성
        (callback) => {
          _course_group_id = util.publishHashByMD5(new Date());
          console.log(_course_group_id);
          callback(null, null);
        },
        // 교육과정 생성
        (callback) => {
          connection.query(QUERY.EDU.InsertEdu,
            [
              _inputs.name,
              _inputs.desc,
              _course_group_id,
              req.user.admin_id,
              _inputs.start_dt,
              _inputs.end_dt
            ],
            (err, result) => {
              callback(err, result);
            }
          );
        },
        // 강의그룹을 입력/수정한다.
        (callback) => {
          for (let index = 0; index < _inputs.course_group_list.length; index++) {
            _inputs.course_group_list[index].course_group_id = _course_group_id;
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
          connection.commit();
          res.json({
            success: true
          });
        }
      });
  });
});

/**
 * 교육과정을 수정한다.
 */
router.put('/modify/edu', isAuthenticated, (req, res) => {
  const _inputs = req.body;
  let _query = null;

  // console.log(_inputs);
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
            });
        }
      ],
      (err, result) => {
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

/**
 * 강의순서 변경
 */
router.put('/coursegroup', isAuthenticated, (req, res) => {
  const _inputs = req.body;
  let _query = null;

  _query = connection.query(QUERY.EDU.UpdateCourseGroup,
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

/**
 * 강의를 그룹에서 삭제한다.
 */
router.delete('/course', isAuthenticated, (req, res) => {
  const _params = req.query;
  let _query = null;

  connection.query(QUERY.EDU.DeleteCourseGroupById, [_params.course_group_id], (err, data) => {
    if (err) {
      res.json({ success: false, msg: err });
    } else {
      res.json({ success: true });
    }
  });
});

/**
 * 교육과정별 포인트 설정
 */
router.post('/pointweight', isAuthenticated, (req, res) => {
  const _eduComplete = req.body.complete;
  const _quizComplete = req.body.quiz;
  const _finalComplete = req.body.final_test;
  const _reeltimeComplete = req.body.reeltime;
  const _speedComplete = req.body.speed;
  const _repsComplete = req.body.reps;
  const _edu_id = req.body.edu_id;
  const _course_group_id = req.body.course_group_id;

  connection.query(QUERY.EDU.SetPointWeight,
    [
      _eduComplete,
      _quizComplete,
      _finalComplete,
      _reeltimeComplete,
      _speedComplete,
      _repsComplete,
      req.user.admin_id,
      _edu_id,
      req.user.fc_id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.redirect('/education/details?id=' + _edu_id + '&course_group_id=' + _course_group_id);
      }
    }
  );
});

/** 교육과정 비활성화 */
router.delete('/deactivate', isAuthenticated, (req, res, next) => {
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
