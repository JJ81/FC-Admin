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
	async.series(
		[
			function (callback) {
				connection.query(QUERY.EDU.GetList, [req.user.fc_id], function (err, rows) {
					if(err){
						console.error(err);
						callback(err, null);
					}else{
						callback(null, rows);
					}
				});
			},
			function (callback) {
				connection.query(QUERY.EDU.GetCourseList, [req.user.fc_id], function (err, rows) {
					if(err){
						console.error(err);
						callback(err, null);
					}else{
						callback(null, rows);
					}
				});
			}
		],
		function (err, result) {
			if(err){
				console.error(err);
			}else{
				res.render('education', {
					current_path: 'Education',
					title: PROJ_TITLE + 'Education',
					loggedIn: req.user,
					list: result[0],
					course_list: result[1]
				});
			}
	});
});


router.get('/details', isAuthenticated, function (req, res) {
	var _course_group_id = req.query.id;
	connection.query(QUERY.EDU.GetCourseListByGroupId,
		[_course_group_id],
		function (err, rows) {
			if(err){
				console.error(err);
			}else{
				res.render('education_details', {
					current_path: 'EducationDetails',
					title: PROJ_TITLE + 'Education Details',
					loggedIn: req.user,
					list: rows
				});
			}
	});
});

const EducationService = require('../service/EducationService');
router.post('/create/edu', isAuthenticated, function (req, res) {
	var _data = {};
	_data.group_id = req.body.course_group_id.trim();
	_data.course_name = req.body.course_name.trim();
	_data.course_desc = req.body.course_desc.trim();
	_data.course_list = req.body.course_list;
	_data.creator_id = req.user.admin_id;

	console.info(_data);

	connection.beginTransaction(function () {
		async.series(
			[
				function (callback) {
					connection.query(QUERY.EDU.InsertCourseDataInEdu, [
						_data.course_name, _data.course_desc, _data.group_id, _data.creator_id
					], function (err, result) {
						if(err){
							console.error(err);
							callback(err, null);
						}else{
							console.info('check!');
							console.info(result);
							callback(null, result);
						}
					});
				},

				function (callback) {
					EducationService.addCourseList(_data.group_id, _data.course_list,
						function (err, result) {
							if(err){
								callback(null, null);
							}else{
								console.info(result);
								callback(null, result);
							}
						});
				}

			],
			function (err, result) {
				if(err) {
					console.error(err);
					console.log('rollback');
					// todo 롤백를 일어나서 데이터 유출이 있을 수도 있다
					connection.rollback();
					res.json({
						success : false
					});
				}else{
					connection.commit();

					console.log('result !!');
					console.info(result);
					res.json({
						success: true
					});
				}
				// connection.rollback();
			});
	});
});


module.exports = router;