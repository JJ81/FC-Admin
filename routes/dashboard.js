var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();
var QUERY = require('../database/query');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
require('../commons/helpers');
const async = require('async');
var DashboardService = require('../service/DashboardService');

router.get('/', isAuthenticated, function (req, res) {

    var _edu_progress = null;

	async.parallel(
		[
            // 총 교육생 수
            // result[0]
			function (callback){
				connection.query(QUERY.DASHBOARD.GetUserCount,
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
            // 총 지점 수
            // result[1]            
			function (callback) {
				connection.query(QUERY.DASHBOARD.GetBranchCount,
					[req.user.fc_id],
					function(err, rows){
						if(err){
							console.error(err);
							callback(err, null);
						}else{
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
				connection.query(QUERY.DASHBOARD.GetRecentPointWeight,
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
                        _edu_progress = rows;                
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
			}
		],
		function (err, result){
			if(err){
				console.error(err);
				throw new Error(err);
			} 
            else
            {
                var branch_progress_bottom_most =
                    result[7].slice(0).sort(function (a, b) {
                        return a.completed_rate - b.completed_rate;
                    });
                
                // 이번 달 교육 진척도에 강의별 이수율 추가한다.   
                DashboardService.getCourseProgress(connection, _edu_progress, function (err, rows) {

                    res.render('dashboard', {
                        current_path: 'Dashboard',
                        title: PROJ_TITLE + 'Dashboard',
                        loggedIn: req.user,
                        total_users : result[0],
                        total_branch : result[1],
                        current_edu: result[2],
                        total_edu : result[3],
                        point_weight : result[4],
                        total_edu_progress : result[5][0],
                        edu_progress : result[6],
                        branch_progress_top_most: result[7],
                        branch_progress_bottom_most: branch_progress_bottom_most,
                    });
                });                  
			}
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

module.exports = router;