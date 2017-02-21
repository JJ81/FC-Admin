var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();
var QUERY = require('../database/query');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())    { return next(); }
  res.redirect('/login');
};
require('../commons/helpers');
const async = require('async');
const EducationService = require('../service/EducationService');
const util = require('../util/util');

/**
 * 교육과정괸리 첫페이지
 */
router.get('/', isAuthenticated, function (req, res) {
  async.series(
    [
      function (callback) {
        connection.query(QUERY.EDU.GetList, [req.user.fc_id], function (err, rows) {
          if (err) {
            console.error(err);
            callback(err, null);
          } else {
            callback(null, rows);
          }
        });
      },
      function (callback) {
      connection.query(QUERY.EDU.GetCourseList, [req.user.fc_id], function (err, rows) {
    if (err) {
    console.error(err);
    callback(err, null);
  } else {
    callback(null, rows);
  }
  });
    }
    ],
		function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result[0]);
    res.render('education', {
    current_path: 'Education',
    menu_group: 'education',
    title: PROJ_TITLE + 'Education',
    loggedIn: req.user,
    list: result[0],
    course_list: result[1]
  });
  }
});
});

/**
 * 교육과정관리 상세페이지
 */
router.get('/details', isAuthenticated, function (req, res) {
  var _params = req.query;

  async.series([

        // 교육과정정보를 조회한다.
        // results[0]
    function (callback) {
        connection.query(QUERY.EDU.GetEduInfoById, [ _params.id ], function (err, data) {
            callback(err, data);
          });
      },

        // 교육과정의 강의목록을 조회한다.
        // results[1]:
    function (callback) {
        connection.query(QUERY.EDU.GetCourseListByGroupId, [ _params.course_group_id ], function (err, data) {
            callback(err, data);
          });
      },

        // 전체 강의목록을 조회한다.
        // results[2]
    function (callback) {
        connection.query(QUERY.EDU.GetCourseList, [ req.user.fc_id ], function (err, data) {
            callback(err, data);
          });
      },

        // 교육과정 포인트 설정값 조회
        // result[3]
    function (callback) {
        _query = connection.query(QUERY.EDU.GetRecentPointWeight,
                [ req.user.fc_id, _params.id ],
                function (err, rows) {
                  if (err) {
                    console.error(err);
                    callback(err, null);
                  } else {
                    _point_weight = rows[0];

                    if (_point_weight != null)                          { callback(null, rows); }                      else                            { callback(null, [{
                              point_complete: 0,
                              point_quiz: 0,
                              point_final: 0,
                              point_reeltime: 0,
                              point_speed: 0,
                              point_repetition: 0
                            }]); 
}
                  }
                }
            );
      }
  ], function (err, results) {
    if (err) {
        console.error(err);
      } else {
        console.log(results[0][0]);

        res.render('education_details', {
            current_path: 'EducationDetails',
            menu_group: 'education',
            title: PROJ_TITLE + 'Education Details',
            loggedIn: req.user,
            edu: results[0][0],
            edu_course_list: results[1],
            course_list: results[2],
            point_weight: results[3]
          });
      }
  });
});

/**
 * 교육과정을 등록한다.
 */
router.post('/create/edu', isAuthenticated, function (req, res) {
  var _inputs = req.body,
    _course_group_id = null;

  connection.beginTransaction(function () {
    async.series(
    [
                // course_group_id 생성
      function (callback) {
      _course_group_id = util.publishHashByMD5(new Date());
      console.log(_course_group_id);
      callback(null, null);
    },

                // 교육과정 생성
      function (callback) {
      connection.query(QUERY.EDU.InsertEdu, [
    _inputs.name,
    _inputs.desc,
    _course_group_id,
    req.user.admin_id,
    _inputs.start_dt,
    _inputs.end_dt
  ], function (err, result) {
  callback(err, result);
});
    },

                // 강의그룹을 입력/수정한다.
      function (callback) {
      for (var index = 0; index < _inputs.course_group_list.length; index++) {
    _inputs.course_group_list[index].course_group_id = _course_group_id;
  }

      EducationService.InsertOrUpdateCourseGroup(connection, _inputs.course_group_list,
						function (err, result) {
  callback(err, result);
}
                    );
    }

				// function (callback) {
				// 	EducationService.addCourseList(_data.group_id, _data.course_list,
				// 		function (err, result) {
				// 			if(err){
				// 				callback(null, null);
				// 			}else{
				// 				console.info(result);
				// 				callback(null, result);
				// 			}
				// 		});
				// }

    ],
			function (err, result) {
  if (err) {
    console.error(err);
    console.log('rollback');
					// todo 롤백를 일어나서 데이터 유출이 있을 수도 있다
    connection.rollback();
    res.json({
    success: false
  });
  } else {
    connection.commit();

    console.log('result !!');
    console.info(result);
    res.json({
    success: true
  });
  }
				// connection.rollback();
});
  });
});

/**
 * 교육과정을 수정한다.
 */
router.put('/modify/edu', isAuthenticated, function (req, res) {
  var _inputs = req.body;
  var _query = null;

  connection.beginTransaction(function () {
    async.series(
    [
        // 교육과정을 수정한다.
      function (callback) {
      _query = connection.query(QUERY.EDU.UpdateEdu, [
    _inputs.name,
    _inputs.desc,
    _inputs.start_dt,
    _inputs.end_dt,
    _inputs.id
  ], function (err, result) {
  console.log(_query.sql);
  callback(err, result);
});
    },

        // 강의그룹을 입력/수정한다.
      function (callback) {
      EducationService.InsertOrUpdateCourseGroup(connection, _inputs.course_group_list,
						function (err, result) {
  callback(err, result);
});
    }
    ],
			function (err, result) {
  if (err) {
    console.error(err);
    connection.rollback();
    return res.json({
  success: false
});
  } else {
    connection.commit();
					 return res.json({
   success: true
 });
  }
});
  });
});

/**
 * 강의순서 변경
 */
router.put('/coursegroup', isAuthenticated, function (req, res) {
  var _inputs = req.body;
  var _query = null;

  _query = connection.query(QUERY.EDU.UpdateCourseGroup, [
    _inputs.order,
    _inputs.id
  ],
        function (err, data) {
          console.log(_query.sql);

          if (err) {
            return res.json({
                success: false,
                msg: err
              });
          } else {
            return res.json({
                success: true
              });
          }
        }
    );
});

/**
 * 강의를 그룹에서 삭제한다.
 */
router.delete('/course', isAuthenticated, function (req, res) {
  var _params = req.query;
  var _query = null;
  _query = connection.query(QUERY.EDU.DeleteCourseGroupById, [_params.course_group_id], function (err, data) {
    console.log(_query.sql);
    if (err) {
      res.json({ success: false, msg: err });
    } else {
      res.json({ success: true });
    }
  });
});

/**
 * 교육과정별 포인트 설정
 */
router.post('/pointweight', isAuthenticated, function (req, res) {
  var _eduComplete = req.body.complete,
	    _quizComplete = req.body.quiz,
	    _finalComplete = req.body.final_test,
	    _reeltimeComplete = req.body.reeltime,
    _speedComplete = req.body.speed,
    _repsComplete = req.body.reps,
    _edu_id = req.body.edu_id,
    _course_group_id = req.body.course_group_id;

  connection.query(QUERY.EDU.SetPointWeight,
    [
      _eduComplete,
      _quizComplete,
      _finalComplete,
      _reeltimeComplete,
      _speedComplete,
      _repsComplete,
      req.user.admin_id,
      _edu_id,
      req.user.fc_id
    ],
		function (err, result) {
  if (err) {
    console.error(err);
    throw new Error(err);
  } else {
    res.redirect('/education/details?id=' + _edu_id + '&course_group_id=' + _course_group_id);
  }
});
});

/** 교육과정 비활성화 */
router.delete('/deactivate', isAuthenticated, function (req, res, next) {
  EducationService.deactivateById(req.query.edu_id, function (err, data) {
    if (err) {
      return res.json({
        success: false,
        msg: err
      });
    }

    return res.json({
      success: true
    });
  });
});

module.exports = router;
