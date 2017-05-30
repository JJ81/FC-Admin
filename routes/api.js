const express = require('express');
const router = express.Router();
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};
const util = require('../util/util');
var CourseService = require('../service/CourseService');
const queryString = require('query-string');
const MessageService = require('../service/MessageService');

router.get('/course/group/id/create', isAuthenticated, (req, res) => {
  res.json({
    id: util.publishHashByMD5(new Date())
  });
});

/**
 * #이슈 IE 에서 route 경로에 "create" 포함 시 axios 가 정상 동작하지 않는다.
 */
router.get('/randomkey', isAuthenticated, (req, res) => {
  res.json({
    id: util.publishHashByMD5(new Date())
  });
});

/**
 * 퀴즈 정보(옵션포함)를 조회한다.
 * url : /api/v1/quiz
 * @params : quiz_group_id
 */
router.get('/quizlist', isAuthenticated, (req, res) => {
  var _inputs = req.query;

  connection.query(QUERY.COURSE.GetQuizDataByGroupId, [_inputs.quiz_group_id], (err, data) => {
    if (err) {
        // 쿼리 실패
      return res.json({
        success: false,
        msg: err
      });
    } else {
      // console.log(data);
      let quiz_list = CourseService.makeQuizList(data);
      // 쿼리 성공
      return res.json({
        success: true,
        quiz_list: quiz_list
      });
    }
  });
});

/**
  SMS 를 전송한다.
 */
router.post('/sms/send', (req, res, next) => {
  const { phone, msg } = req.body;
  MessageService.sendMessage(phone, msg, (response) => {
    console.log(response);
  });
});

router.get('/test', (req, res) => {
  MessageService.send('교육과정이 배정되었습니다.', (err, data) => {
    return res.json({
      success: true
    });
  });
});

module.exports = router;
