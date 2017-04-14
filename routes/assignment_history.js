const express = require('express');
const router = express.Router();
const QUERY = require('../database/query');
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');
const AssignmentService = require('../service/AssignmentService');

router.get('/', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.HISTORY.GetAssignEduHistory(true), [req.user.fc_id], (err, rows) => {
      connection.release();
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.render('assignment_history', {
          current_path: 'Assignment_history',
          menu_group: 'education',
          title: '교육과정 배정이력',
          loggedIn: req.user,
          list: rows
        });
      }
    });
  });
});

/**
 * log_assign_edu 를 삭제한다.
 */
router.delete('/', util.isAuthenticated, (req, res, next) => {
  AssignmentService.deactivateEduAssignmentById(req.query.id, (err, data) => {
    if (err) {
      return res.status(500).send({
        'success': false,
        'msg': err
      });
    } else {
      res.send({
        'success': true
      });
    }
  });
});

module.exports = router;
