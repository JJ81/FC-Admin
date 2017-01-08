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
	connection.query(QUERY.HISTORY.GetAssignEduHistory,[req.user.fc_id], function (err, rows) {
		if(err){
			console.error(err);
			throw new Error(err);
		}else{
			res.render('achievement', {
				current_path: 'Achievement',
				title: PROJ_TITLE + 'Achievement',
				loggedIn: req.user,
				list : rows
			});
		}
	});
});

router.get('/details', isAuthenticated, function (req, res) {
	var _training_edu_id = req.query.id;
	var _edu_id = req.query.edu_id;

	// todo 전체 강의당 세션 수를 가져온다

	// todo 해당 교육에 배정된 유저들의 데이터를 가져온다.

	// todo 점포별 이수율을 가져온다.

	// todo 진행중인 교육의 강의 번호를 가져와야 한다



	async.waterfall(
		[
			// 교육 내 강의 데이터와 강의 내 세션 개수를 가져온다.
			function (callback){
				connection.query(QUERY.ACHIEVEMENT.GetTotalSessByEdu,
					[_edu_id],
					function (err, rows) {
						if(err){
							console.error(err);
							callback(err, null);
						}else{
							callback(null, rows);
						}
				});
			},

			// 강의 아이디 배열을 통하여 유저 리스트를 이수율에 따라서 순서대로 가져오기
			function (course_info, callback) {
				// todo 강의 아이디만 배열에 담아서 사용한다.
				var course_id = [];

				for(var i = 0, len = course_info.length;i<len;i++){
					course_id.push(course_info[i].course_id);
				}

				connection.query(QUERY.ACHIEVEMENT.GetListWithCompletedSessByTrainingEduId,
					[course_id, _training_edu_id],
					function (err, rows) {
						if(err){
							console.error(err);
							callback(err, null);
						}else{
							callback(null, course_info, rows);
						}
					});
			},

			function (course_info, list_info, callback){
				var course_id = [];

				for(var i = 0, len = course_info.length;i<len;i++){
					course_id.push(course_info[i].course_id);
				}

				connection.query(QUERY.ACHIEVEMENT.GetCompletionByBranch,
					[course_id, _training_edu_id],
					function (err, rows) {
						if(err){
							console.error(err);
							callback(err, null);
						}else{
							callback(null, course_info, list_info, rows);
						}
				});
			},

			function (course_info, list_info, branch_info, callback) {
				connection.query(QUERY.ACHIEVEMENT.GetEduInfoById,
					[_edu_id],
					function (err, rows) {
						if(err){
							console.error(err);
							callback(err, null);
						}else{
							callback(null, course_info, list_info, branch_info, rows);
						}
					});
			}
		],

		function (err, course_info, list_info, branch_info, edu_info){
			if(err){
				console.error(err);
				throw new Error(err);
			}else{


				console.info(branch_info);

				// 교육 내부에 총 세션 개수를 구한다.
				var _total = 0;
				for(var j= 0, len2 = course_info.length; j<len2;j++){
					// console.info(course_info[j].sess_total);
					_total += parseInt(course_info[j].sess_total);
				}

				res.render('achievement_details', {
					current_path: 'AchievementDetails',
					title: PROJ_TITLE + 'Achievement Details',
					loggedIn: req.user,
					user_list: list_info,
					total_sess : _total,
					branch_info : branch_info,
					edu_info : edu_info
				});
			}
		});
});

module.exports = router;