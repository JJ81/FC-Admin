const express = require('express');
const router = express.Router();
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');
const async = require('async');
const AssignmentService = require('../service/AssignmentService');

router.param('id', AssignmentService.getSimpleAssignmentById);

router.get('/', util.isAuthenticated, util.getLogoInfo, AssignmentService.getSimpleAssignmentList);

router.get('/:id', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  console.log(req.assignment);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series([
      (callback) => {
        connection.query(QUERY.EMPLOYEE.GetEmployeeListByAssignUserId,
          [ req.assignment.log_bind_user_id, req.user.fc_id ],
          (err, rows) => {
            callback(err, rows);
          });
      }
    ],
    (err, results) => {
      connection.release();
      if (err) {
        console.error(err);
      } else {
        res.render('simple-assignment-detail', {
          title: '교육개설',
          current_path: 'SimpleAssignment',
          menu_group: 'education',
          loggedIn: req.user,
          employees: results[0],
          assignment: req.assignment
        });
      }
    });
  });
});

router.post('/', util.isAuthenticated, AssignmentService.createSimpleAssignment);
router.post('/progress', util.isAuthenticated, AssignmentService.updateProgress);
router.delete('/', util.isAuthenticated, AssignmentService.deleteSimpleAssignment);

module.exports = router;
