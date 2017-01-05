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


module.exports = router;