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

router.get('/', isAuthenticated, function (req, res) {

	async.parallel(
		[
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
			// 가중치 설정값 가져오기
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
			}
		],
		function (err, result){
			if(err){
				console.error(err);
				throw new Error(err);
			}else{
				res.render('dashboard', {
					current_path: 'Dashboard',
					title: PROJ_TITLE + 'Dashboard',
					loggedIn: req.user,
					total_users : result[0],
					total_branch : result[1],
					current_edu: result[2],
					total_edu : result[3],
					point_weight : result[4]
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