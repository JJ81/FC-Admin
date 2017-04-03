const express = require('express');
const router = express.Router();
// var mysql_dbc = require('../commons/db_conn')();
// var connection = mysql_dbc.init();
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
const DashboardService = require('../service/DashboardService');
const pool = require('../commons/db_conn_pool');

/**
 * 메인
 * 1. 총 교육생 수
 * 2. 총 지점 수
 * 3. 총 진행중인 교육과정
 * 4. 총 교육과정
 * 5. 포인트 가중치 설정값
 * 6. 이번 달 전체 교육 이수율
 * 7. 이번 달 교육 진척도
 * 8. 교육 이수율 랭킹 (지점)
 * 9. 포인트 현황
 */
router.get('/', isAuthenticated, (req, res) => {
  let eduProgress = null;
  // let pointWeight = null;
  // let query = null;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        // 총 교육생 수
        // result[0]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetUserCount,
            [ req.user.fc_id ],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        },
        // 총 지점 수
        // result[1]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetBranchCount,
            [ req.user.fc_id ],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        },
        // 총 진행중인 교육과정
        // result[2]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetCurrentEduCount,
            [req.user.fc_id],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        },
        // 총 교육과정
        // result[3]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetTotalEduCount,
            [req.user.fc_id],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                callback(null, rows);
              }
            });
        },
        // 포인트 가중치 설정값
        // result[4]
        (callback) => {
          callback(null, null);
        },
        // 이번 달 전체 교육 이수율
        // result[5]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetThisMonthProgress,
            [ req.user.fc_id ],
            (err, rows) => {
              callback(err, rows);
            }
          );
        },
        // 이번 달 교육 진척도
        // result[6]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetThisMonthProgressByEdu,
            [ req.user.fc_id ],
            (err, rows) => {
              eduProgress = rows;
              callback(err, rows);
            }
          );
        },
        // 교육 이수율 랭킹 (지점)
        // result[7]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetBranchProgressAll,
            [ req.user.fc_id ],
            (err, rows) => {
              callback(err, rows);
            }
          );
        },
        // 포인트 현황
        // result[8]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetUserPointList,
            [
              req.user.fc_id,
              req.user.fc_id
            ],
            (err, rows) => {
              callback(err, rows);
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
          var branchBottomMost =
            result[7].slice(0).sort((a, b) => {
              return a.completed_rate - b.completed_rate;
            });

          // 이번 달 교육 진척도에 강의별 이수율 추가한다.
          DashboardService.getCourseProgress(connection, eduProgress, (err, rows) => {
            if (err) {
              console.error(err);
              throw new Error(err);
            }

            res.render('dashboard', {
              current_path: 'Dashboard',
              title: global.PROJ_TITLE + 'Dashboard',
              loggedIn: req.user,
              total_users: result[0],
              total_branch: result[1],
              current_edu: result[2],
              total_edu: result[3],
              point_weight: result[4],
              total_edu_progress: result[5][0],
              edu_progress: result[6],
              branch_progress_top_most: result[7],
              branch_progress_bottom_most: branchBottomMost,
              point_rank: result[8]
            });
          });
        }
      });
  });
});

/**
 * 포인트 상세내역 조회
 */
router.get('/point/details', isAuthenticated, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.DASHBOARD.GetUserPointDetails,
      [ req.user.fc_id, req.query.user_id ],
      (err, data) => {
        connection.release();

        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: err
          });
        } else {
          let list = [];
          for (let index = 0; index < data.length; index++) {
            let item = JSON.parse(data[index].logs);
            item.point_complete = data[index].point_complete;
            item.point_quiz = data[index].point_quiz;
            item.point_final = data[index].point_final;
            item.point_reeltime = data[index].point_reeltime;
            item.point_speed = data[index].point_speed;
            item.point_repetition = data[index].point_repetition;
            list.push(item);
          }
          console.log(list);
          res.json({
            success: true,
            list: list
          });
        }
      }
    );
  });
});

/**
 * 가중치 등록
 */
router.post('/point/weight/record', isAuthenticated, (req, res) => {
  const _eduComplete = req.body.complete;
  const _quizComplete = req.body.quiz;
  const _finalComplete = req.body.final_test;
  const _reeltimeComplete = req.body.reeltime;
  const _speedComplete = req.body.speed;
  const _repsComplete = req.body.reps;

  connection.query(QUERY.DASHBOARD.SetPointWeight,
    [
      _eduComplete,
      _quizComplete,
      _finalComplete,
      _reeltimeComplete,
      _speedComplete,
      _repsComplete,
      req.user.admin_id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.redirect('/dashboard');
      }
    });
});

/**
 * 교육과정별 포인트 현황을 반환한다.
 */
router.get('/edupoint', isAuthenticated, (req, res) => {
  const _inputs = req.query;
  let query = null;
  let pointWeight = null;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        // 포인트 가중치 설정값
        (callback) => {
          query = connection.query(QUERY.DASHBOARD.GetRecentPointWeight,
            [req.user.fc_id],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                pointWeight = rows[0];
                if (pointWeight != null) {
                  callback(null, rows);
                } else {
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
            });
        },
        // 교육과정별 포인트 현황
        (callback) => {
          if (pointWeight != null) {
            query = connection.query(QUERY.DASHBOARD.GetUserPointListByEduId,
              [
                req.user.fc_id,
                req.user.fc_id,
                _inputs.edu_id
              ],
              (err, rows) => {
                if (err) console.log(err);
                for (let index = 0; index < rows.length; index++) {
                  let logs = JSON.parse(rows[index].logs);
                  rows[index].period = logs.edu_start_dt + ' ~ ' + logs.edu_end_dt;
                  rows[index].complete = logs.complete.complete_course_count + ' / ' + logs.complete.total_course_count;
                  rows[index].quiz_correction = logs.quiz_correction.correct_count + ' / ' + logs.quiz_correction.total_count;
                  rows[index].final_correction = logs.final_correction.correct_count + ' / ' + logs.final_correction.total_count;
                  rows[index].reeltime = logs.reeltime.played_seconds + ' / ' + logs.reeltime.duration;
                  rows[index].speed = logs.speed.user_period + ' / ' + logs.speed.edu_period;
                  rows[index].repetition = logs.repetition.value == 1 ? '예' : '아니오';
                }
                callback(err, rows);
              }
            );
          } else {
            callback(null, null);
          }
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
            data: results[1]
          });
        }
      });
  });
});

module.exports = router;
