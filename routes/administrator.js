const express = require('express');
const router = express.Router();
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
require('../commons/helpers');

router.get('/', isAuthenticated, function (req, res) {

	connection.query(QUERY.ADMIN.GetList,
		[req.user.fc_id],
		function (err, rows) {
			if(err){
				console.error(err);
				throw new Error(err);
			}else{
				res.render('administrator', {
					current_path: 'Administrator',
					title: PROJ_TITLE + 'administrator',
					loggedIn: req.user,
					list : rows
				});
			}
	});
});

module.exports = router;