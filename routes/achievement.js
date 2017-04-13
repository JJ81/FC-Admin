const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const async = require('async');
const pool = require('../commons/db_conn_pool');
const util = require('../util/util');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  let querystring;

  // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
  if (req.user.role === 'supervisor') {
    querystring = QUERY.HISTORY.GetAssignEduHistory2;
  } else {
    querystring = QUERY.HISTORY.GetAssignEduHistory;
  }

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(querystring, [req.user.fc_id, req.user.admin_id], (err, rows) => {
      connection.release();
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.render('achievement', {
          menu_group: 'achievement',
          current_path: 'Achievement',
          title: '교육과정별 진척도',
          loggedIn: req.user,
          list: rows
        });
      }
    });
  });
});

/**
 * 교육생별 진척도
 */
router.get('/user', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
    connection.query(QUERY.ACHIEVEMENT.GetUserProgressAll,
      [
        req.user.fc_id,
        req.user.admin_id,
        req.user.fc_id
      ],
      (err, rows) => {
        connection.release();
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          res.render('achievement_user', {
            menu_group: 'achievement',
            current_path: 'AchievementUser',
            title: '교육생별 진척도',
            loggedIn: req.user,
            list: rows
          });
        }
      }
    );
  });
});

/**
 * 교육생의 교육과정별 진척도
 */
router.get('/user/details', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  const { user_id: userId, showall } = req.query;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    // todo 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
    connection.query(QUERY.ACHIEVEMENT.GetUserEduProgressAll(showall),
      [
        req.user.fc_id,
        userId
      ],
      (err, rows) => {
        connection.release();
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          let sum = 0;
          for (var value of rows) {
            sum += value.completed_rate;
          }
          let avg = 0;
          if (sum !== 0) {
            avg = (sum / rows.length).toFixed(2);
          }

          res.render('achievement_user_details', {
            menu_group: 'achievement',
            current_path: 'AchievementUserDetails',
            title: '교육생별 상세 진척도',
            loggedIn: req.user,
            userid: userId,
            list: rows,
            showall: showall,
            avg_completed_rate: avg
          });
        }
      }
    );
  });
});

/**
 * 교육생의 강의별 진척도
 */
router.get('/user/education', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  const { training_user_id: trainingUserId } = req.query;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
    connection.query(QUERY.ACHIEVEMENT.GetUserEduCourseProgress(),
      [
        req.user.fc_id,
        trainingUserId
      ],
      (err, rows) => {
        connection.release();
        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          res.send({
            list: rows,
            progress_bar_theme: res.locals.themeOfProgressBar
          });
        }
      }
    );
  });
});

/**
 * 교육진척도 상세화면
 */
router.get('/details', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  // var trainingUserId = req.query.id;
  const eduId = req.query.edu_id;
  let pointWeight = null;
  const showAll = (req.user.role !== 'supervisor');

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series([
      // 지점별 진척도
      (callback) => {
        connection.query(QUERY.ACHIEVEMENT.GetBranchProgressAllByEdu(showAll), [
          req.user.fc_id,
          eduId,
          eduId,
          req.user.admin_id
        ],
        (err, data) => {
          callback(err, data); // results[0]
        });
      },
      // 포인트 설정값 조회
      (callback) => {
        connection.query(QUERY.EDU.GetRecentPointWeight,
          [ req.user.fc_id, eduId ],
          (err, data) => {
            pointWeight = data[0];
            // console.log(pointWeight);
            if (pointWeight == null) {
              pointWeight = {
                point_complete: 0,
                point_quiz: 0,
                point_final: 0,
                point_reeltime: 0,
                point_speed: 0,
                point_repetition: 0
              };
            }
            callback(err, data); // results[1]
          });
      },
      // 교육생별 진척도
      (callback) => {
        connection.query(QUERY.ACHIEVEMENT.GetUserProgressAllByEdu(showAll),
          [
            pointWeight.point_complete,
            pointWeight.point_quiz,
            pointWeight.point_final,
            pointWeight.point_reeltime,
            pointWeight.point_speed,
            pointWeight.point_repetition,
            req.user.fc_id,
            eduId,
            eduId,
            req.user.admin_id
          ],
          (err, data) => {
            callback(err, data); // results[2]
          });
      },
      // 교육정보 조회
      (callback) => {
        connection.query(QUERY.ACHIEVEMENT.GetEduInfoById, [
          eduId
        ],
        (err, data) => {
          callback(err, data); // results[3]
        });
      }
    ],
    (err, results) => {
      connection.release();
      if (err) {
        console.error(err);
      } else {
        // console.info(results);
        res.render('achievement_details', {
          menu_group: 'achievement',
          current_path: 'AchievementDetails',
          title: '교육과정별 진척도 상세',
          loggedIn: req.user,
          branch_progress: results[0],
          user_progress: results[2],
          edu_name: results[3][0].name
        });
      }
    });
  });
});

module.exports = router;
