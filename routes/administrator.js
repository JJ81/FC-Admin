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
const bcrypt = require('bcrypt');
const util = require('../util/util');


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

router.post('/register', isAuthenticated, function (req, res) {
	var _data = {};
	_data.name = req.body.name.trim();
	_data.email = req.body.email.trim();
	_data.role = req.body.authority.trim();
	_data.pass = req.body.pass.trim();
	_data.re_pass = req.body.re_pass.trim();

	if(
		_data.pass !== _data.re_pass ||
		_data.name === '' ||
		_data.email === '' ||
		_data.pass === '' ||
		_data.re_pass === '' ||
		!util.isValidEmail(_data.email) ||
		!util.checkPasswordSize(_data.pass, 4)
	)
	{
		res.redirect('/process?url=administrator&msg=error');
	}else{
		connection.query(QUERY.ADMIN.CreateAdmin,
			[
				_data.name,
				_data.email,
				bcrypt.hashSync(_data.pass, 10),
				_data.role,
				req.user.fc_id
			],
			function (err, result) {
				if(err){
					console.log('eeeeeeeee');
					console.error(err);
					res.redirect('/process?url=administrator&msg=error');
				}else{
					res.redirect('/administrator');
				}
			});
	}
});



module.exports = router;