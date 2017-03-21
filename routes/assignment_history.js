var express = require('express');
var router = express.Router();
var QUERY = require('../database/query');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
require('../commons/helpers');
const pool = require('../commons/db_conn_pool');
const AssignmentService = require('../service/AssignmentService');

router.get('/', isAuthenticated, (req, res) => {
  pool.getConnection((err, connInPool) => {
    if (err) throw err;
    connInPool.query(QUERY.HISTORY.GetAssignEduHistory, [req.user.fc_id], (err, rows) => {
      connInPool.release();
      if (err) {
        console.error(err);
        throw new Error(err);
      } else {
        res.render('assignment_history', {
          current_path: 'Assignment_history',
          menu_group: 'education',
          title: PROJ_TITLE + 'Assignment History',
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
router.delete('/', isAuthenticated, (req, res, next) => {
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
