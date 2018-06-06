const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const pool = require('../commons/db_conn_pool');
const util = require('../util/util');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  if (req.user.fc_id !== 12) return next('Not Allowed');

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.ANALYTICS.Select, [], (err, rows) => {
      connection.release();
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.render('analytics', {
          current_path: 'Analytics',
          title: '이용현황',
          list: rows
        });
      }
    });
  });
});

module.exports = router;
