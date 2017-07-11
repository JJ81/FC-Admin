const express = require('express');
const router = express.Router();
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');
const async = require('async');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series([
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetEmployeeList,
          [req.user.fc_id],
          (err, data) => {
            callback(err, data);
          });
      }
    ],
    (err, results) => {
      connection.release();
      if (err) {
        console.error(err);
      } else {
        res.render('simple-assignment', {
          title: '교육 간편배정',
          current_path: 'SimpleAssignment',
          menu_group: 'education',
          loggedIn: req.user,
          employees: results[0]
        });
      }
    });
  });
});

module.exports = router;
