var express = require('express');
var router = express.Router();
// var mysql_dbc = require('../commons/db_conn')();
// var connection = mysql_dbc.init();
var QUERY = require('../database/query');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
require('../commons/helpers');
const async = require('async');
var DashboardService = require('../service/DashboardService');
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
router.get('/', isAuthenticated, function (req, res) {

    var eduProgress = null;
    var pointWeight = null;
    var query = null;

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    async.series(
      [
        // 총 교육생 수
        // result[0]
        function (callback) {
          connection.query(QUERY.DASHBOARD.GetUserCount,
            [req.user.fc_id],
            function (err, rows) {
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
        function (callback) {
          connection.query(QUERY.DASHBOARD.GetBranchCount,
            [req.user.fc_id],
            function (err, rows){
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
        function (callback) {
          connection.query(QUERY.DASHBOARD.GetCurrentEduCount,
            [req.user.fc_id],
            function (err, rows) {
              if(err){
                console.error(err);
                callback(err, null);
              }else{
                callback(null, rows);
              }
          });
        },
        // 총 교육과정
        // result[3]
        function (callback){
          connection.query(QUERY.DASHBOARD.GetTotalEduCount,
            [req.user.fc_id],
            function (err, rows) {
              if(err){
                console.error(err);
                callback(err, null);
              }else{
                callback(null, rows);
              }
          });
        },
        // 포인트 가중치 설정값
        // result[4]
        function (callback) {
            callback(null, null);
        },
        // 이번 달 전체 교육 이수율
        // result[5]
        function (callback) {
          connection.query(QUERY.DASHBOARD.GetThisMonthProgress,
            [ req.user.fc_id ],
            function (err, rows) {
              callback(err, rows);
            }
          );
        },
        // 이번 달 교육 진척도
        // result[6]
        function (callback) {
          connection.query(QUERY.DASHBOARD.GetThisMonthProgressByEdu,
            [ req.user.fc_id ],
            function (err, rows) {
              eduProgress = rows;
              callback(err, rows);
            }
          );
        },
        // 교육 이수율 랭킹 (지점)
        // result[7]
        function (callback) {
          connection.query(QUERY.DASHBOARD.GetBranchProgressAll,
            [ req.user.fc_id ],
            function (err, rows) {
              callback(err, rows);
            }
          );
        },
        // 포인트 현황
        // result[8]
        function (callback) {
          query = connection.query(QUERY.DASHBOARD.GetUserPointList,
            [
              req.user.fc_id,
              req.user.fc_id
            ],
            function (err, rows) {
              callback(err, rows);
            }
          );
        }
      ],
      function (err, result){

        connection.release();

        if (err) {
          console.error(err);
          throw new Error(err);
        } else {
          var branchBottomMost =
            result[7].slice(0).sort(function (a, b) {
              return a.completed_rate - b.completed_rate;
            });

            // 이번 달 교육 진척도에 강의별 이수율 추가한다.
          DashboardService.getCourseProgress(connection, eduProgress, function (err, rows) {
            if (err) {
              console.error(err);
              throw new Error(err);
            }

            res.render('dashboard', {
              current_path: 'Dashboard',
              title: PROJ_TITLE + 'Dashboard',
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
router.get('/point/details', isAuthenticated, function (req, res) {

    var query = null;

    pool.getConnection(function (err, connection) {
      if (err) throw err;

      query = connection.query(QUERY.DASHBOARD.GetUserPointDetails, [ req.user.fc_id, req.query.user_id ], function (err, data) {
        connection.release();

        if (err) {
            console.log(err);
            res.json({
                success: false,
                msg: err
            });
        } else {
          var list = [];
          for (var index = 0; index < data.length; index++) {
            var item = JSON.parse(data[index].logs);
            item.point_complete = data[index].point_complete;
            item.point_quiz = data[index].point_quiz;
            item.point_final = data[index].point_final;
            item.point_reeltime = data[index].point_reeltime;
            item.point_speed = data[index].point_speed;
            item.point_repetition = data[index].point_repetition;
            list.push(item);
          }

          res.json({
            success: true,
            list: list
          });
        }
      });
    });
});

/**
 * 가중치 등록
 */
router.post('/point/weight/record', isAuthenticated, function (req, res) {

	var _eduComplete = req.body.complete;
	var _quizComplete = req.body.quiz;
	var _finalComplete = req.body.final_test;
	var _reeltimeComplete = req.body.reeltime;
	var _speedComplete = req.body.speed;
	var _repsComplete = req.body.reps;

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
		function (err, result){
			if(err){
				console.error(err);
				throw new Error(err);
			}else{
				res.redirect('/dashboard');
			}
	});
});

/**
 * 교육과정별 포인트 현황을 반환한다.
 */
router.get('/edupoint', isAuthenticated, function (req, res) {

  var _inputs = req.query;
  var query = null;
  var pointWeight = null;

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    async.series(
      [
        // 포인트 가중치 설정값
        function (callback) {
          query = connection.query(QUERY.DASHBOARD.GetRecentPointWeight,
            [req.user.fc_id],
            function (err, rows) {
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
                    point_repetition: 0,
                  }]);
                }
              }
          });
        },
        // 교육과정별 포인트 현황
        function (callback) {
          if  (pointWeight != null) {
            query = connection.query(QUERY.DASHBOARD.GetUserPointListByEduId,
                [
                  req.user.fc_id,
                  req.user.fc_id,
                  _inputs.edu_id
                ],
                function (err, rows) {
                    if (err) console.log(err);
                    // console.log(query.sql);
                    // console.log(rows);

                    for (var index = 0; index < rows.length; index++) {
                      var logs = JSON.parse(rows[index].logs);
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
      function (err, results) {
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