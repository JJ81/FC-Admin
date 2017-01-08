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
			}
		],
		function (err, result){
			if(err){
				console.error(err);
				throw new Error(err);
			}else{

				console.info(result);

				res.render('dashboard', {
					current_path: 'Dashboard',
					title: PROJ_TITLE + 'Dashboard',
					loggedIn: req.user,
					total_users : result[0],
					total_branch : result[1],
					current_edu: result[2],
					total_edu : result[3]
				});
			}
	});


});

module.exports = router;