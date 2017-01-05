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



router.get('/', isAuthenticated, function (req, res) {
	connection.query(QUERY.EDU.GetList, function (err, rows) {
		if(err){
			console.error(err);
		}else{
			res.render('education', {
				current_path: 'Education',
				title: PROJ_TITLE + 'Education',
				loggedIn: req.user,
				list: rows
			});
		}
	});
});



module.exports = router;