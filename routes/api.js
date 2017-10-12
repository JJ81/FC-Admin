const express = require('express');
const router = express.Router();
const mysqlDbc = require('../commons/db_conn')();
const connection = mysqlDbc.init();
const QUERY = require('../database/query');
const pool = require('../commons/db_conn_pool');
const async = require('async');
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};
const util = require('../util/util');
var CourseService = require('../service/CourseService');
const MessageService = require('../service/MessageService');
const AquaPlayerService = require('../service/AquaPlayerService');
const formidable = require('formidable');
const path = require('path');
const unirest = require('unirest');

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
router.post('/sms/send', util.isAuthenticated, (req, res, next) => {
  const { phones, msg } = req.body;

  const phonesArray = phones.split(',');
  let logs = [];
  for (let phone of phonesArray) {
    logs.push([ req.user.admin_id, req.user.fc_id, msg, phone ]);
  }

  // console.log(logs);
  // return res.status(200).send('success!');

  if (phones === undefined || msg === undefined) {
    return res.status(500).send('잘못된 파라미터가 입력되었습니다.');
  }
  MessageService.sendMessage(req.user.fc_name, phones, msg, (response) => {
    console.log(response.body);

    pool.getConnection((err, connection) => {
      if (err) throw err;
      async.series([
        (callback) => {
          connection.query(QUERY.COMMON.InsertMessageLog, [logs], (err, rows) => {
            callback(err, rows);
          });
        }
      ],
      (err, results) => {
        connection.release();
        if (err) {
          console.error(err);
        } else {
          return res.json({
            success: true
          });
        }
      });
    });
  });
});

/**
  SMS 를 전송한다.
 */
router.post('/sendnumber', util.isAuthenticated, (req, res, next) => {
  const { phone } = req.body;

  if (phone === undefined) {
    return res.status(500).send('잘못된 파라미터가 입력되었습니다.');
  }
  MessageService.registSendNumber(phone, (response) => {
    return res.json({
      success: true,
      msg: response.body
    });
  });
});

router.get('/test', (req, res) => {
  MessageService.send('교육과정이 배정되었습니다.', (err, data) => {
    return res.json({
      success: true
    });
  });
});

router.get('/player/encparam', AquaPlayerService.getEncodedParam);
router.get('/aqua', util.isAuthenticated, util.getLogoInfo, AquaPlayerService.show);
router.get('/demo/aquaplayer', util.isAuthenticated, util.getLogoInfo, AquaPlayerService.demo);

router.get('/fineuploader/token', (req, res, next) => {
  const apiKey = 'dfdd93a2a66608bed75697abffb5aaeb';
  unirest.get(`http://api.wecandeo.com/web/v4/uploadToken.json?key=${apiKey}`)
  .end(function (response) {
    console.log(response.body);
    return res.send(response.body);
  });
});

router.post('/fineuploader', (req, res, next) => {
  let filePath = null;
  let incomingForm = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: true,
    multiples: false,
    uploadDir: path.join(__dirname, '/../public/uploads')
  });

  incomingForm.parse(req, (err, fields, files) => {
    if (err) throw err;

    console.log(fields);
    filePath = files.videofile.path;
    // console.log(filePath);

    return res.send({
      success: true
    });
  });
});

router.get('/youtube', (req, res, next) => {
  console.log(req.query.id);
  return res.render('winpops/win_youtube_player', {
    layout: 'layout_youtube_player.hbs',
    title: '유투브',
    video_id: req.query.id
  });
});

module.exports = router;
