const express = require('express');
const router = express.Router();
const util = require('../util/util');
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');
const async = require('async');
const AssignmentService = require('../service/AssignmentService');
const CourseService = require('../service/CourseService');
// const EducationService = require('../service/EducationService');

router.param('id', AssignmentService.getSimpleAssignmentById);

router.get('/', util.isAuthenticated, util.getLogoInfo, AssignmentService.getSimpleAssignmentList);
router.get('/courses', util.isAuthenticated, util.getLogoInfo, AssignmentService.getCoursesToAdd);
router.get('/:id', util.isAuthenticated, util.getLogoInfo, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    async.series([
      callback => {
        connection.query(QUERY.EMPLOYEE.GetEmployeeListByAssignUserIdByRole(req.assignment.log_bind_user_id, req.user),
          [],
          (err, rows) => {
            callback(err, rows);
          });
        // connection.query(QUERY.EMPLOYEE.GetEmployeeListByAssignUserId,
        //   [ req.assignment.log_bind_user_id, req.user.fc_id ],
        //   (err, rows) => {
        //     callback(err, rows);
        //   });
      },
      callback => {
        // 강의추가를 목적으로 강의목록을 조회한다.
        CourseService.getCourseList(req.user.fc_id, (err, results) => {
          callback(err, results);
        });
      },
      callback => {
        // 교육과정 추가를 목적으로 교육과정 목록을 조회한다.
        // 단, 현재 이미 다른 교육과정이 매칭되어 있을 경우 해당 교육과정은 제외.
        connection.query(QUERY.EDU.GetEduListForSimpleAssignment(req.user.fc_id),
          [],
          (err, rows) => {
            callback(err, rows);
          }
        );
      },
      callback => {
        connection.query(QUERY.TAG.SelectEduTags,
          [ req.assignment.edu_id ],
          (err, rows) => {
            callback(err, rows);
          }
        );
      }
    ],
    (err, results) => {
      connection.release();

      console.log(req.assignment);

      if (err) {
        console.error(err);
      } else {
        res.render('simple-assignment-detail', {
          title: '교육개설',
          current_path: 'SimpleAssignment',
          menu_group: 'education',
          loggedIn: req.user,
          employees: results[0],
          assignment: req.assignment,
          courses: results[1][0],
          educations: results[2],
          eduTags: results[3]
        });
      }
    });
  });
});

router.post('/', util.isAuthenticated, AssignmentService.createSimpleAssignment);
router.post('/courses', util.isAuthenticated, AssignmentService.addCourses);
router.post('/progress', util.isAuthenticated, AssignmentService.updateProgress);
router.delete('/', util.isAuthenticated, AssignmentService.deleteSimpleAssignment);

module.exports = router;
