var express = require('express');
var router = express.Router();
var mySqlDbc = require('../commons/db_conn')();
var connection = mySqlDbc.init();
var QUERY = require('../database/query');
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};
require('../commons/helpers');
const async = require('async');

router.get('/', isAuthenticated, (req, res) => {
  var querystring = null;

  // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
  if (req.user.role === 'supervisor') {
    querystring = QUERY.HISTORY.GetAssignEduHistory2;
  } else {
    querystring = QUERY.HISTORY.GetAssignEduHistory;
  }

  connection.query(querystring, [req.user.fc_id, req.user.admin_id], (err, rows) => {
    if (err) {
      console.error(err);
      throw new Error(err);
    } else {
      res.render('achievement', {
        menu_group: 'achievement',
        current_path: 'Achievement',
        title: PROJ_TITLE + 'Achievement',
        loggedIn: req.user,
        list: rows
      });
    }
  });
});

/**
 * 교육생별 진척도
 */
router.get('/user', isAuthenticated, (req, res) => {
  // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
  connection.query(QUERY.ACHIEVEMENT.GetUserProgressAll,
    [
      req.user.fc_id,
      req.user.admin_id,
      req.user.fc_id
    ],
    (err, rows) => {
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.render('achievement_user', {
          menu_group: 'achievement',
          current_path: 'AchievementUser',
          title: global.PROJ_TITLE + 'User Achievement',
          loggedIn: req.user,
          list: rows
        });
      }
    }
  );
});

/**
 * 교육생의 교육과정별 진척도
 */
router.get('/user/details', isAuthenticated, (req, res) => {
  const { user_id: userId, showall } = req.query;

  // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
  connection.query(QUERY.ACHIEVEMENT.GetUserEduProgressAll(showall),
    [
      userId
    ],
    (err, rows) => {
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        let sum = 0;
        for (var value of rows) {
          sum += value.completed_rate;
        }
        let avg = (sum / rows.length).toFixed(2);

        res.render('achievement_user_details', {
          menu_group: 'achievement',
          current_path: 'AchievementUserDetails',
          title: global.PROJ_TITLE + 'User Achievement Details',
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

/**
 * 교육생의 교육과정별 진척도
 */
router.get('/user/education', isAuthenticated, (req, res) => {
  const { training_user_id: trainingUserId } = req.query;

  // 슈퍼바이저일 경우 자신의 점포만 볼 수 있다.
  connection.query(QUERY.ACHIEVEMENT.GetUserEduCourseProgress(),
    [
      trainingUserId
    ],
    (err, rows) => {
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.send({
          list: rows
        });
      }
    }
  );
});

/**
 * 교육진척도 상세화면
 */
router.get('/details', isAuthenticated, (req, res, next) => {
  // var trainingUserId = req.query.id;
  const eduId = req.query.edu_id;
  let pointWeight = null;
  let queryLogger = null;

  if (req.user.role === 'supervisor') {
    async.series([
      (callback) => {
        // 지점별 진척도
        queryLogger = connection.query(QUERY.ACHIEVEMENT.GetBranchProgress, [
          req.user.fc_id,
          req.user.admin_id,
          eduId,
          eduId
        ],
        (err, data) => {
          callback(err, data); // results[0]
        });
      },
      // 포인트 설정값 조회
      (callback) => {
        queryLogger = connection.query(QUERY.EDU.GetRecentPointWeight,
          [ req.user.fc_id, eduId ],
          (err, data) => {
            pointWeight = data[0];
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
      (callback) => {
        // 교육생별 진척도
        queryLogger = connection.query(QUERY.ACHIEVEMENT.GetUserProgress,
          [
            pointWeight.point_complete,
            pointWeight.point_quiz,
            pointWeight.point_final,
            pointWeight.point_reeltime,
            pointWeight.point_speed,
            pointWeight.point_repetition,
            req.user.fc_id,
            req.user.admin_id,
            eduId,
            eduId
          ],
          (err, data) => {
            callback(err, data); // results[2]
          });
      },
      (callback) => {
        queryLogger = connection.query(QUERY.ACHIEVEMENT.GetEduInfoById, [
          eduId
        ],
        (err, data) => {
          callback(err, data); // results[3]
        });
      }
    ],
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        res.render('achievement_details', {
          menu_group: 'achievement',
          current_path: 'AchievementDetails',
          title: PROJ_TITLE + 'Achievement Details',
          loggedIn: req.user,
          branch_progress: results[0],
          user_progress: results[2],
          edu_name: results[3][0].name
        });
      }
    });
  } else {
    async.series([
      // 지점별 진척도
      (callback) => {
        queryLogger = connection.query(QUERY.ACHIEVEMENT.GetBranchProgressAllByEdu, [
          req.user.fc_id,
          eduId,
          eduId
        ],
        (err, data) => {
          callback(err, data); // results[0]
        });
      },
      // 포인트 설정값 조회
      (callback) => {
        queryLogger = connection.query(QUERY.EDU.GetRecentPointWeight,
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
        queryLogger = connection.query(QUERY.ACHIEVEMENT.GetUserProgressAllByEdu,
          [
            pointWeight.point_complete,
            pointWeight.point_quiz,
            pointWeight.point_final,
            pointWeight.point_reeltime,
            pointWeight.point_speed,
            pointWeight.point_repetition,
            req.user.fc_id,
            eduId,
            eduId
          ],
          (err, data) => {
            callback(err, data); // results[2]
          });
      },
      // 교육정보 조회
      (callback) => {
        queryLogger = connection.query(QUERY.ACHIEVEMENT.GetEduInfoById, [
          eduId
        ],
        (err, data) => {
          callback(err, data); // results[3]
        });
      }
    ],
    (err, results) => {
      if (err) {
        console.error(err);
      } else {
        // console.info(results);
        res.render('achievement_details', {
          menu_group: 'achievement',
          current_path: 'AchievementDetails',
          title: PROJ_TITLE + 'Achievement Details',
          loggedIn: req.user,
          branch_progress: results[0],
          user_progress: results[2],
          edu_name: results[3][0].name
        });
      }
    });
  }
});

module.exports = router;
