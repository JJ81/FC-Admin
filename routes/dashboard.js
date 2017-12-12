const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const async = require('async');
// const DashboardService = require('../service/DashboardService');
const pool = require('../commons/db_conn_pool');
const util = require('../util/util');

let startTime, endTime;

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  // let eduProgress = null;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        // 총 교육생 수
        // result[0]
        (callback) => {
          startTime = new Date();
          connection.query(QUERY.DASHBOARD.GetUserCount(req.user),
            [],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                endTime = new Date() - startTime;
                console.info('GetUserCount time: %dms', endTime);

                callback(null, rows);
              }
            });
        },
        // 총 점포 수
        // result[1]
        (callback) => {
          startTime = new Date();

          connection.query(QUERY.DASHBOARD.GetBranchCount(req.user),
            [],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                endTime = new Date() - startTime;
                console.info('GetBranchCount time: %dms', endTime);

                callback(null, rows);
              }
            });
        },
        // 총 진행중인 교육과정
        // result[2]
        (callback) => {
          startTime = new Date();

          connection.query(QUERY.DASHBOARD.GetCurrentEduCount(req.user),
            [],
            (err, rows) => {
              if (err) {
                console.error(err);
                callback(err, null);
              } else {
                endTime = new Date() - startTime;
                console.info('GetCurrentEduCount time: %dms', endTime);

                callback(null, rows);
              }
            });
        },
        // 총 교육과정
        // result[3]
        // (callback) => {
        //   connection.query(QUERY.DASHBOARD.GetTotalEduCount,
        //     [req.user.fc_id],
        //     (err, rows) => {
        //       if (err) {
        //         console.error(err);
        //         callback(err, null);
        //       } else {
        //         callback(null, rows);
        //       }
        //     });
        // },
        // 포인트 가중치 설정값
        // result[4]
        // (callback) => {
        //   callback(null, null);
        // },
        // 이번 달 교육과정 이수율
        // result[3]
        (callback) => {
          startTime = new Date();

          connection.query(QUERY.DASHBOARD.GetThisMonthProgress(req.user),
            [],
            (err, rows) => {
              endTime = new Date() - startTime;
              console.info('GetThisMonthProgress time: %dms', endTime);

              callback(err, rows);
            }
          );
        },
        // 이번 달 교육과정별 이수율
        // result[4]
        (callback) => {
          startTime = new Date();

          connection.query(QUERY.DASHBOARD.GetThisMonthProgressByEdu(req.user),
            [],
            (err, rows) => {
              endTime = new Date() - startTime;
              console.info('GetThisMonthProgressByEdu time: %dms', endTime);

              // eduProgress = rows;
              callback(err, rows);
            }
          );
        },
        // 점포 이수율 랭킹 (점포)
        // result[5]
        (callback) => {
          connection.query(QUERY.DASHBOARD.GetBranchProgressAll(req.user),
            [],
            (err, rows) => {
              callback(err, rows);
            }
          );
        },
        // 포인트 현황
        // result[6]
        (callback) => {
          startTime = new Date();

          connection.query(QUERY.DASHBOARD.GetUserPointList(req.user),
            [],
            (err, rows) => {
              endTime = new Date() - startTime;
              console.info('GetUserPointList time: %dms', endTime);

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
            result[5].slice(0).sort((a, b) => {
              return a.completed_rate - b.completed_rate;
            });

          res.render('dashboard', {
            current_path: 'Dashboard',
            title: '대시보드',
            loggedIn: req.user,
            total_users: result[0],
            total_branch: result[1],
            current_edu: result[2],
            total_edu_progress: result[3][0],
            edu_progress: result[4],
            branch_progress_top_most: result[5],
            branch_progress_bottom_most: branchBottomMost,
            point_rank: result[6]
          });

          // 이번 달 교육 진척도에 강의별 이수율 추가한다.
          // startTime = new Date();
          // DashboardService.getCourseProgress(connection, eduProgress, (err, rows) => {
          //   endTime = new Date() - startTime;
          //   console.info('getCourseProgress time: %dms', endTime);

          //   connection.release();
          //   if (err) {
          //     console.error(err);
          //     throw new Error(err);
          //   }

          //   res.render('dashboard', {
          //     current_path: 'Dashboard',
          //     title: '대시보드',
          //     loggedIn: req.user,
          //     total_users: result[0],
          //     total_branch: result[1],
          //     current_edu: result[2],
          //     // total_edu: result[3],
          //     // point_weight: result[4],
          //     total_edu_progress: result[3][0],
          //     edu_progress: result[4],
          //     branch_progress_top_most: result[5],
          //     branch_progress_bottom_most: branchBottomMost,
          //     point_rank: result[6]
          //   });
          // });
        }
      });
  });
});

/**
 * 포인트 상세내역 조회
 */
router.get('/point/details', util.isAuthenticated, (req, res) => {
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
          // console.log(list);
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
router.post('/point/weight/record', util.isAuthenticated, (req, res) => {
  const _eduComplete = req.body.complete;
  const _quizComplete = req.body.quiz;
  const _finalComplete = req.body.final_test;
  const _reeltimeComplete = req.body.reeltime;
  const _speedComplete = req.body.speed;
  const _repsComplete = req.body.reps;

  pool.getConnection((err, connection) => {
    if (err) throw err;
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
      }
    );
  });
});

/**
 * 교육과정별 포인트 현황을 반환한다.
 */
router.get('/edupoint', util.isAuthenticated, (req, res) => {
  const _inputs = req.query;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series(
      [
        // 포인트 가중치 설정값
        // (callback) => {
        //   connection.query(QUERY.DASHBOARD.GetRecentPointWeight,
        //     [req.user.fc_id],
        //     (err, rows) => {
        //       if (err) {
        //         console.error(err);
        //         callback(err, null);
        //       } else {
        //         pointWeight = rows[0];
        //         if (pointWeight != null) {
        //           callback(null, rows);
        //         } else {
        //           callback(null, [{
        //             point_complete: 0,
        //             point_quiz: 0,
        //             point_final: 0,
        //             point_reeltime: 0,
        //             point_speed: 0,
        //             point_repetition: 0
        //           }]);
        //         }
        //       }
        //     });
        // },
        // 교육과정별 포인트 현황
        (callback) => {
          // if (pointWeight != null) {
          connection.query(QUERY.DASHBOARD.GetUserPointListByEduId(_inputs.edu_id, req.user),
            [],
            (err, rows) => {
              // console.log(q.sql);
              if (err) throw err;

              for (let index = 0; index < rows.length; index++) {
                if (rows[index].logs !== null) {
                  // console.log(rows[index].logs);
                  let logs = JSON.parse(rows[index].logs);
                  let period;

                  if (logs.edu_start_dt === null) {
                    period = '시작전';
                  } else if (logs.edu_end_dt === null) {
                    period = logs.edu_start_dt + ' ~ ' + '미완료';
                  } else {
                    period = logs.edu_start_dt + ' ~ ' + logs.edu_end_dt;
                  }

                  let userPeriod = logs.speed.user_period === null ? 0 : logs.speed.user_period;

                  rows[index].period = period; // eduStart + ' ~ ' + eduFinish;
                  rows[index].complete = logs.complete.complete_course_count + ' / ' + logs.complete.total_course_count;
                  rows[index].quiz_correction = logs.quiz_correction.correct_count + ' / ' + logs.quiz_correction.total_count;
                  rows[index].final_correction = logs.final_correction.correct_count + ' / ' + logs.final_correction.total_count;
                  rows[index].reeltime =
                    (logs.reeltime.video_watch_count === undefined ? '0' : logs.reeltime.video_watch_count) + ' / ' +
                    (logs.reeltime.video_count === undefined ? '0' : logs.reeltime.video_count);
                  // rows[index].reeltime = logs.reeltime.played_seconds + ' / ' + logs.reeltime.duration;
                  rows[index].speed = userPeriod + ' / ' + logs.speed.edu_period;
                  rows[index].repetition = logs.repetition.value === 1 ? '예' : '아니오';
                } else {
                  rows[index].period = '';
                  rows[index].complete = '';
                  rows[index].quiz_correction = '';
                  rows[index].final_correction = '';
                  rows[index].reeltime = '';
                  rows[index].speed = '';
                  rows[index].repetition = '';
                }
              }
              // console.log(rows);
              callback(err, rows);
            }
          );
          // } else {
          //   callback(null, null);
          // }
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

module.exports = router;
