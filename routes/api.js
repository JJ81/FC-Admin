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
const util = require('../util/util');

router.get('/course/group/id/create', isAuthenticated, function (req, res) {
	res.json({
		id : util.publishHashByMD5(new Date())
	});
});



module.exports = router;