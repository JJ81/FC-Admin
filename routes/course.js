var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();
var QUERY = require('../database/query');
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
require('../commons/helpers');
var async = require('async');
var UTIL = require('../util/util');
var CourseService = require('../service/CourseService');

/**
 * 강의/강사등록 첫 페이지
 */
router.get('/', isAuthenticated, function (req, res) {

  async.series(
    [
      function (callback) {
        connection.query(QUERY.COURSE.GetCourseList,
          [req.user.fc_id], function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, rows);
            }
          });
      },
      function (callback){
        connection.query(QUERY.COURSE.GetTeacherList,
          [req.user.fc_id],
          function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, rows);
            }
          });
      }
    ],
    function (err, result){
      if(err){
        console.error(err);
      }else{
        res.render('course', {
          current_path: 'Course',
          title: PROJ_TITLE + 'Course',
          loggedIn: req.user,
          list : result[0],
          teacher_list : result[1]
        });
      }
  });
});

/**
 * 강의/강사등록 상세페이지
 */
router.get('/details', isAuthenticated, function (req, res) {

  var _id = req.query.id;
  var _teacher_id = null;

  async.series([
    // 강의정보를 조회한다.
    // result[0]
    function(callback){
        connection.query(QUERY.COURSE.GetCourseListById,
            [req.user.fc_id, _id], 
            function (err, rows) {
                if(err){
                    callback(err, null);
                    // todo 쿼리에 문제가 일어난 것이므로 500 페이지로 이동시킨다.
                }else{
                    callback(null, rows);
                }
            });
    },
    // 강의평가 정보를 조회한다.
    // result[1]
    function (callback) {
        connection.query(QUERY.COURSE.GetStarRatingByCourseId,
            [_id],
            function (err, rows) {
                if (err) {
                    console.error(err);
                    callback(err, null);
                } else {
                    if (rows.length === 0 || rows === null) {
                        callback(null, [{course_id : _id ,rate : 0}]);
                    } else {
                        callback(null, rows);
                    }
                }
        });
    },
    // 강의 세션목록을 조회한다.
    // result[2]
    function (callback) {
        connection.query(QUERY.COURSE.GetSessionListByCourseId,
            [_id],
            function (err, rows) {
            if(err){
                console.error(err);
                callback(err, null);
            }else{
                callback(null, rows);
            }
        });
    },
    // 강사 정보를 조회한다.
    // result[3]
    function (callback) {
        connection.query(QUERY.COURSE.GetTeacherInfoByCourseId,
            [_id],
            function (err, rows) {                
                if(err){
                    console.error(err);
                    callback(err, null);
                }else{
                    _teacher_id = rows[0].teacher_id;
                    callback(null, rows);
                }
            }
        );
    },
    // 강사 목록을 조회한다.
    // result[4]
    function (callback){
        connection.query(QUERY.COURSE.GetTeacherList,
            [req.user.fc_id],
            function (err, rows) {
                if(err){
                    console.error(err);
                    callback(err, null);
                }else{
                    callback(null, rows);
                }
            }
        );
    },
    // 강사평가 정보를 조회한다.
    // result[5]
    function (callback) {
        connection.query(QUERY.COURSE.GetStarRatingByTeacherId,
            [ _teacher_id ],
            function (err, rows) {
                if (err) {
                    console.error(err);
                    callback(err, null);
                } else {
                    if (rows.length === 0 || rows === null) {
                        callback(null, [{course_id : _id ,rate : 0}]);
                    } else {
                        callback(null, rows);
                    }
                }
            }
        );
    }],    
    // out
    function (err, result) {
      if(err){
        console.error(err);
      }else{

        console.log(result);

        res.render('course_details', {
            current_path: 'CourseDetails',
            title: PROJ_TITLE + 'Course Details',
            loggedIn: req.user,
            list : result[0],
            rating: result[1],
            session_list: result[2],
            teacher_info : result[3],
            teacher_list : result[4],
            teacher_rating : result[5],
            course_id : _id
        });
      }
  });
});

/**
 * 강의 세션수를 조회한다.
 */
router.get('/sessioncount', isAuthenticated, function (req, res) {

    var _id = req.query.id;
    connection.query(QUERY.COURSE.GetSessionCount, [_id], function (err, data) {
        if (err) {
            // 쿼리 실패
            return res.json({
                success: false,
                msg: err
            });    
        } else {     
            // 쿼리 성공
            return res.json({
                success: true,
                session_count: data[0].session_count
            });
        }
    });

});

/**
 * 강의/강사등록 > 강의생성
 */
router.post('/register', isAuthenticated, function (req, res) {
  var course_name = req.body.course_name.trim();
  var course_desc = req.body.course_desc.trim();
  var teacher = req.body.teacher_id.trim();
  var admin_id = req.user.admin_id;

  connection.query(QUERY.COURSE.CreateCourse,
    [
      course_name,
      teacher,
      course_desc,
      admin_id
    ],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course');
      }
  });
});

/**
 * 강의/강사등록 > 강의수정
 */
router.post('/modify', isAuthenticated, function (req, res) {
  var _course_id = req.body.course_id.trim();
  var _course_name = req.body.course_name.trim();
  var _course_desc = req.body.course_desc.trim();
  var _teacher_id = req.body.teacher_id.trim();

  connection.query(QUERY.COURSE.UpdateCourse,
    [
      _course_name,
      _teacher_id,
      _course_desc,
      req.user.admin_id,
      new Date(),
      _course_id
    ],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course/details?id=' + _course_id);
      }
  });
});

/**
 * 강의/강사등록 상세페이지 > 강사등록
 */
router.post('/create/teacher', isAuthenticated, function (req, res){
  var _name = req.body.teacher.trim();
  var _desc = req.body.teacher_desc.trim();

  connection.query(QUERY.COURSE.CreateTeacher,
    [_name, _desc, req.user.admin_id],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course');
      }
  });
});

/**
 * 강의/강사등록 상세페이지 > 강사수정
 */
router.post('/modify/teacher', isAuthenticated, function (req, res){
    
  var _id = req.body.id,
      _name = req.body.teacher.trim(),
      _desc = req.body.teacher_desc.trim();

  connection.query(QUERY.COURSE.UpdateTeacher,
    [ _name, _desc, _id ],
    function (err, rows) {
      if(err){
        console.error(err);
      }else{
        res.redirect('/course');
      }
  });
});
////////////////////////////////////////////////////////////////////////////////////////// 비디오

/**
 * 강의/강사등록 상세페이지 > 등록된 비디오 보기
 */
router.get('/video', isAuthenticated, function (req, res) {

  var _video_id = req.query.id;

	connection.query(QUERY.COURSE.GetVideoDataById,
		[_video_id],
		function (err, rows) {
			if(err){
				console.error(err);
			}else{

				console.info(rows);

				res.render('winpops/win_show_video', {
					current_path: 'winpop',
					title: PROJ_TITLE + 'Video',
					loggedIn: req.user,
					video : rows
				});
			}
	});
});

/**
 * 강의/강사등록 상세페이지 > 비디오 생성 팝업
 */
router.get('/create/video', isAuthenticated, function (req, res) {
	var _course_id = req.query.course_id;

	res.render('winpops/win_create_video', {
		current_path: 'winpop',
        module_type: 'create_video',
		title: PROJ_TITLE + 'Register Video',
		loggedIn: req.user,
		course_id: _course_id
	});
});

/**
 * 비디오 등록하기
 */
router.post('/create/video', isAuthenticated, function(req, res){

	/**
	 * video table에 name, type, url, admin을 먼저 입력하고
	 * 리턴받은 video_id를 가지고
	 * course_list 테이블에
	 * course_id, type(VIDEO), title(=name), quiz_group_id(null), video_id, order는 기본값
	 * 으로 설정하고 트랜잭션을 걸어서 처리한다.
	 *
	 */
	var _course_id = req.body.course_id.trim();
	var _video_name = req.body.video_name.trim();
	var _video_provider = req.body.video_provider.trim();
	var _video_code = req.body.video_code.trim();
	var _admin_id = req.user.admin_id;

	connection.beginTransaction(function () {
		async.waterfall(
			[
				function(callback){
					connection.query(QUERY.COURSE.CreateVideo,
						[
							_video_name,
							_video_provider,
							_video_code,
							_admin_id
						],
						function(err, result){
							if(err){
								console.error(err);
								callback(err, null);
							}else{
								callback(null, result);
							}
					});
				},

				function (ret, callback){
					var _video_id = ret.insertId;
					connection.query(QUERY.COURSE.InsertIntoCourseListForVideo,
						[
							_course_id,
							'VIDEO',
							_video_name,
							_video_id
						],
						function (err, result){
							if(err){
								console.error(err);
								callback(err, null);
							}else{
								callback(null, result);
							}
					});
				}
			],
			function (err, result){
				if(err){
					connection.rollback();
                    return res.json({
                        success: false,
                        msg: err
                    });
				}else{
					if(result){
						//console.info(result);
						connection.commit();
						// todo 팝업을 닫고 parent창을 리프레시를 해야 한다 그럼 어떻게 처리해야 하는가? ajax밖에 없겠군...
						// res.redirect('/course/details?id=' + _course_id);
                        return res.json({
                            success: true
                        });
					}
				}
		});
	});
});

/**
 * 강의/강사등록 상세페이지 > 비디오 수정 팝업
 */
router.get('/modify/video', isAuthenticated, function (req, res) {

    var _params = req.query;

	connection.query(QUERY.COURSE.GetVideoDataById,
		[ _params.video_id ],
		function (err, data) {
            console.log(data[0]);
			if (err) {
				console.error(err);
			} else {
                res.render('winpops/win_modify_video', {
                    current_path: 'winpop',
                    module_type: 'modify_video',
                    title: PROJ_TITLE + 'Modify Video',
                    loggedIn: req.user,
                    video: data[0],
                    course_id: _params.course_id,
                    course_list_id: _params.course_list_id
                });
			}
	});
});

/**
 * 강의/강사등록 상세페이지 > 비디오 수정
 */
router.put('/modify/video', isAuthenticated, function (req, res) {

    var _inputs = req.body;
    var _query = null;

    // console.log(_inputs);
    // return res.json({
    //     success: true
    // });

    connection.beginTransaction(function(err) {

        // 트렌젝션 오류 발생
        if (err) { 
            res.json({
                success: false,
                msg: err
            });
        }

        async.series([
            // 세션 수정
            function (callback) {            
                _query = connection.query(QUERY.COURSE.UpdateSessionTitleById, [_inputs.video_name, _inputs.course_list_id], function (err, data) {
                    console.log(_query.sql);
                    callback(err, data);
                });
            },
            // 비디오 수정
            function (callback) {
                _query = connection.query(QUERY.COURSE.UpdateVideoById, [
                        _inputs.video_name, 
                        _inputs.video_provider, 
                        _inputs.video_code, 
                        _inputs.video_id
                    ],
                    function (err, data) {
                        console.log(_query.sql);
                        callback(err, data);
                    }
                );
            }
            ], 
            function (err, results) {
                if (err) {
                    // 쿼리 오류
                    return connection.rollback(function() {
                        res.json({
                            success: false,
                            msg: err
                        });
                    });
                } else {
                    connection.commit(function(err) {
                        // 커밋 오류
                        if (err) {
                            return connection.rollback(function() {
                                    res.json({
                                    success: false,
                                    msg: err
                                });
                            });
                        }

                        // 커밋 성공
                        res.json({
                            success: true
                        });
                    });
                }
            });  
        });    
});

////////////////////////////////////////////////////////////////////////////////////////// 퀴즈

/**
 * 퀴즈 보기 페이지를 제공한다.
 */
router.get('/quiz', isAuthenticated, function (req, res) {

    var _inputs = req.query;
    var _query = null;

    _query = connection.query(QUERY.COURSE.GetQuizDataByGroupId, [ _inputs.id ], function (err, data) {
        if (err) {
            // 쿼리 실패
            console.error(err);
        } else {     
            var quiz_list = CourseService.makeQuizList(data);
            // console.log(quiz_list[2]);

            // 쿼리 성공
            res.render('winpops/win_show_quiz', {
                current_path: 'winpop',
                module_type: 'show_quiz',
                title: PROJ_TITLE + 'Quiz',
                loggedIn: req.user,
                type: _inputs.type,
                quiz_title: _inputs.title,
                quiz: quiz_list
            });      
        }
    });


});

/**
 * 강의/강사등록 상세페이지 > 등록된 퀴즈 보기
 * (deprecated)
 */
router.get('/quiz_x', isAuthenticated, function (req, res) {
    
	var _quiz_group_id = req.query.id;
	var _title = req.query.title;
	var _type = req.query.type;
    var _query = null;

	_query = connection.query(QUERY.COURSE.GetQuizDataByGroupId,
		[ _quiz_group_id ],
		function (err, rows) {

            console.log(_query.sql);

			if(err){
				console.error(err);
			}else{

				// console.info(rows);

				const _quiz = CourseService.makeQuizList(rows);

                console.log(_quiz);

				res.render('winpops/win_quiz', {
					current_path: 'winpop',
					title: PROJ_TITLE + 'Quiz',
					loggedIn: req.user,
					quiz_title : _title,
					quiz : _quiz,
					type : _type
				});
			}
		});
});

/**
 * 강의/강사등록 상세페이지 > 퀴즈/파이널테스트 생성 팝업
 */
router.get('/create/quiz', isAuthenticated, function (req, res) {
    
	var _course_id = req.query.course_id;
    var _type = req.query.type;

	res.render('winpops/win_create_quiz', {
		current_path: 'winpop',
        module_type: 'create_quiz', 
        type: req.query.type,
		title: PROJ_TITLE + 'Create ' + req.query.type,
		loggedIn: req.user,
		course_id: req.query.course_id
	});
});

/**
 * 강의세션을 등록한다.
 */
router.post('/quiz/courselist', isAuthenticated, function (req, res) {

    var inputs = req.body;
    var _query = null;

    _query = connection.query(QUERY.COURSE.InsertIntoCourseListForQuiz, [ 
            inputs.course_id, 
            inputs.type,
            inputs.title,
            inputs.quiz_group_id,
            inputs.order
        ],
        function (err, data) {
            inputs.course_list_id = data.insertId;
            console.log(_query.sql);

            if (err) {
                return res.json({
                    success: false,
                    msg: err
                });
            } else {
                inputs.course_list_id = data.insertId;
                return res.json({
                    success: true,
                    inputs: inputs
                });
            }
            
        }
    );

});

/**
 * 강의/강사등록 상세페이지 > 퀴즈 생성 팝업 > 퀴즈 그룹 등록
 * 
 * 진행순서
 * 1. 퀴즈 (quiz)를 생성.
 * 2. 퀴즈 그룹 (quiz_group)을 생생.
 * 3. 보기 (quiz_option)를 생성. (선택형/다답형)
 * @return quiz_id
 */
router.post('/quiz', isAuthenticated, function (req, res) {

    var inputs = req.body;

    connection.beginTransaction(function(err) {

        if (err) { 
            res.json({
                success: false,
                msg: err
            });
        }

        async.series([
  
            // 퀴즈를 생성한다.
            function (callback) {                
                if (inputs.quiz.options.length) {  
                    // 선택형, 다답형            
                    _query = connection.query(QUERY.COURSE.CreateQuizWithOption, [ 
                            inputs.quiz.type, 
                            inputs.quiz.quiz_type,
                            inputs.quiz.question, 
                            inputs.quiz.option_group_id 
                        ], 
                        function (err, data) {
                            console.log(_query.sql);
                            inputs.quiz.quiz_id = data.insertId;
                            callback(err, data);
                        }
                    );
                } else {
                    // 단답형
                    _query = connection.query(QUERY.COURSE.CreateQuizNoOption, [ 
                            inputs.quiz.type, 
                            inputs.quiz.quiz_type,
                            inputs.quiz.question, 
                            inputs.quiz.answer_desc 
                        ], 
                        function (err, data) {
                            console.log(_query.sql);
                            inputs.quiz.quiz_id = data.insertId;
                            callback(err, data);
                        }
                    );    
                }
            },
            // 퀴즈 그룹을 생생한다.
            function (callback) {  
                if (inputs.quiz.quiz_id) {
                    _query = connection.query(QUERY.COURSE.InsertOrUpdateQuizGroup, [ 
                            inputs.quiz_group_id, 
                            inputs.quiz.quiz_id, 
                            inputs.quiz.order,
                            inputs.quiz.order
                        ],
                        function (err, data) {
                            console.log(_query.sql);
                            callback(err, data); // results[1]
                        }
                    );
                } else {
                    callback(null, null);
                }
            },
            // 퀴즈 보기를 생성한다.
            function (callback) {                
                if (inputs.quiz.options.length) {
                    CourseService.InsertOrUpdateQuizOptions(connection, inputs.quiz.options, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(null, null);
                }
            }
        ], 
        function (err, results) {
            if (err) {
                // 쿼리 오류 발생
                return connection.rollback(function() {
                    res.json({
                        success: false,
                        msg: err                        
                    });
                });
            } else {
            connection.commit(function(err) {
                // 커밋 오류 발생
                if (err) {
                    return connection.rollback(function() {
                        res.json({
                            success: false,
                            msg: err
                        });
                    });
                }

                // 커밋 성공
                res.json({
                    success: true,
                    inputs: inputs
                });
            });
            }
        });  
    }); 
});

/**
 * 강의/강사등록 상세페이지 > 퀴즈 생성 팝업 > 퀴즈 그룹 등록
 * 
 * 진행순서
 * 1. 퀴즈 (quiz)를 수정.
 * 2. 보기 (quiz_option)를 재생성. (선택형/다답형)
 */
router.put('/quiz', isAuthenticated, function (req, res) {

    var inputs = req.body;
    var _query = null;

    connection.beginTransaction(function(err) {

        if (err) { 
            res.json({
                success: false,
                msg: err
            });
        }
        
        async.series([
  
            // 퀴즈를 수정한다.
            function (callback) {                
                if (inputs.quiz.options.length) {  
                    // 선택형, 다답형
                    _query = connection.query(QUERY.COURSE.UpdateQuizWithOption, [                            
                            inputs.quiz.question,
                            inputs.quiz.quiz_id
                        ], 
                        function (err, data) {
                            console.log(_query.sql);
                            callback(err, data);
                        }
                    );
                } else {                    
                    // 단답형
                    _query = connection.query(QUERY.COURSE.UpdateQuizWithNoOption, [                            
                            inputs.quiz.question, 
                            inputs.quiz.answer_desc,
                            inputs.quiz.quiz_id
                        ], 
                        function (err, data) {
                            console.log(_query.sql);
                            callback(err, data);
                        }
                    );    
                }
            },
            // 퀴즈 그룹을 수정한다.
            function (callback) {  
                if (inputs.quiz.quiz_id) {
                    _query = connection.query(QUERY.COURSE.InsertOrUpdateQuizGroup, [ 
                            inputs.quiz_group_id, 
                            inputs.quiz.quiz_id, 
                            inputs.quiz.order,
                            inputs.quiz.order
                        ],
                        function (err, data) {
                            console.log(_query.sql);
                            callback(err, data);
                        }
                    );
                } else {
                    callback(null, null);
                }
            },            
            // 퀴즈 보기를 수정한다.
            function (callback) {
                if (inputs.quiz.quiz_id) {
                    CourseService.InsertOrUpdateQuizOptions(connection, inputs.quiz.options, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(null, null);
                }
            }
        ], 
        function (err, results) {
            if (err) {
                console.log(err);
                // 쿼리 오류 발생
                return connection.rollback(function() {
                    res.json({
                        success: false,
                        msg: err                        
                    });
                });
            } else {
            connection.commit(function(err) {
                // 커밋 오류 발생
                if (err) {
                    return connection.rollback(function() {
                        res.json({
                            success: false,
                            msg: err
                        });
                    });
                }

                // 커밋 성공
                res.json({
                    success: true,
                    inputs: inputs
                });
            });
            }
        });  
    }); 
});

/**
 * 퀴즈를 삭제한다.
 */
router.delete('/quiz', isAuthenticated, function (req, res) {

    var inputs = req.query,
        query = null;

    // return res.json({
    //     success: true,
    //     inputs: inputs
    // });

    connection.beginTransaction(function(err) {

        // 트렌젝션 오류 발생시 처리
        if (err) { 
            res.json({
                success: false,
                msg: err
            });
        }

        async.series([            

            // 1.퀴즈 보기(quiz_option) 삭제
            function (callback) {
                query = connection.query(QUERY.COURSE.DeleteQuizOptionByOptionGroupId, [inputs.option_group_id], function (err, data) {
                    console.log(query.sql);
                    callback(err, data);
                });
            },
            // 2.퀴즈(quiz) 를 삭제한다.
            function (callback) {
                query = connection.query(QUERY.COURSE.DeleteQuizById, [inputs.quiz_id], function (err, data) {
                    console.log(query.sql);
                    callback(err, data);
                });
            },
            // 3.퀴즈 보기 그룹(quiz_group) 삭제 (CASCADE 제약으로 함께 삭제된다.)        
            ], 
            function (err, results) {
                if (err) {
                    // 쿼리 오류
                    return connection.rollback(function() {
                        res.json({
                            success: false,
                            msg: err
                        });
                    });
                } else {
                    connection.commit(function(err) {
                        // 커밋 오류
                        if (err) {
                            return connection.rollback(function() {
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            });
                        }

                        // 커밋 성공
                        return res.json({
                            success: true
                        });
                    });
                }
            }
        );  
    });
    
});


/**
 * 퀴즈/파이널테스트 수정페이지를 보여준다.
 * @req.query
 * course_id, course_list_id, type: QUIZ/FINAL, quiz_group_id
 */
router.get('/modify/quiz', isAuthenticated, function (req, res) {
    
    var _inputs = req.query;
    var _course_list = null;
    var _query = null;

    async.series([
        // 세션정보를 조회한다.
        // results[0]
        function (callback) {
            _query = connection.query(QUERY.COURSE.GetSessionById, [_inputs.course_list_id], function (err, data) {
                // console.log(_query.sql);
                callback(err, data);
            });
        },
        // 퀴즈 정보를 조회한다.
        // results[1]
        // function (callback) {
        //     _query = connection.query(QUERY.GetQuizDataByGroupId, [_inputs.quiz_group_id], function (err, data) {
        //         console.log(_query.sql);
        //         callback(err, data);
        //     });
        // }
        ], 
        function (err, results) {
            if (err) {
                console.error(err);
            } else {
                // console.log(results[0]);
                res.render('winpops/win_modify_quiz', {
                    current_path: 'winpop',
                    module_type: 'modify_quiz', 
                    type: req.query.type,        
                    title: PROJ_TITLE + 'Modify ' + req.query.type,
                    loggedIn: req.user,
                    course_list: results[0][0]
                });
            }
    });

});


/**
 * 퀴즈 보기를 개별삭제한다.
 */
router.delete('/quiz/option', isAuthenticated, function (req, res) {

    var inputs = req.query,
        query = null;

    // return res.json({
    //     success: true,
    //     inputs: inputs
    // });

    connection.beginTransaction(function(err) {

        // 트렌젝션 오류 발생시 처리
        if (err) { 
            res.json({
                success: false,
                msg: err
            });
        }

        async.series([
                // 1.퀴즈 보기(quiz_option) 삭제
                function (callback) {
                    query = connection.query(QUERY.COURSE.DeleteQuizOptionById, [inputs.option_id], function (err, data) {
                        console.log(query.sql);
                        callback(err, data);
                    });
                }        
            ], 
            function (err, results) {
                if (err) {
                    // 쿼리 오류
                    return connection.rollback(function() {
                        res.json({
                            success: false,
                            msg: err
                        });
                    });
                } else {
                    connection.commit(function(err) {
                        // 커밋 오류
                        if (err) {
                            return connection.rollback(function() {
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            });
                        }

                        // 커밋 성공
                        return res.json({
                            success: true
                        });
                    });
                }
            }
        );  
    });    

});

////////////////////////////////////////////////////////////////////////////////////////// 세션

/**
 * 강의세션을 수정한다.
 */
router.put('/courselist', isAuthenticated, function (req, res) {

    var inputs = req.body;
    var _query = null;

    _query = connection.query(QUERY.COURSE.UpdateSession, [             
            inputs.title,
            inputs.course_list_order,
            inputs.course_list_id
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
 * 퀴즈를 삭제한다.
 * 
 * @req.query : 
 *  course_list_id, course_list_type, quiz_group_id
 * 
 * 진행순서
 *  1. 비디오/퀴즈/파이널테스트 중 어떤것인지 파악 
 *
 * 비디오일 경우:
 *  1. course_list 삭제
 *  2. video 삭제
 * 
 * 퀴즈 / 파이널테스트일 경우:
 *  1. 세션정보(course_list) 삭제
 *  2. 퀴즈 보기(quiz_option) 삭제
 *  3. 퀴즈(quiz) 를 삭제한다.
 *  4. 퀴즈 보기 그룹(quiz_group) 삭제
 */
router.delete('/courselist', isAuthenticated, function (req, res) {

    var _inputs = req.query,
        _query = null;
    
    // console.log(_inputs);
    // return res.json({
    //     success: true,
    //     inputs: _inputs
    // });

    connection.beginTransaction(function(err) {

        // 트렌젝션 오류 발생시 처리
        if (err) { 
            res.json({
                success: false,
                msg: err
            });
        }

        async.series([            
            // 1. 세션정보 삭제
            function (callback) {
                connection.query(QUERY.COURSE.DeleteCourseListId, [_inputs.course_list_id], function (err, data) {
                    callback(err, data);
                });
            },
            // 2. 퀴즈 보기 삭제
            function (callback) {
                if (_inputs.course_list_type === 'QUIZ' || _inputs.course_list_type === 'FINAL') {
                    var query = connection.query(QUERY.COURSE.DeleteQuizOptionByGroupId, [_inputs.quiz_group_id], function (err, data) {
                        callback(err, data);
                    });
                } else if (_inputs.course_list_type === 'VIDEO') {
                    callback(null, null);
                }
            },
            // 3.퀴즈/비디오 를 삭제한다.
            function (callback) {
                if (_inputs.course_list_type === 'QUIZ' || _inputs.course_list_type === 'FINAL') {
                    connection.query(QUERY.COURSE.DeleteQuizByGroupId, [_inputs.quiz_group_id], function (err, data) {
                        callback(err, data);
                    });
                } else if (_inputs.course_list_type === 'VIDEO') {
                    connection.query(QUERY.COURSE.DeleteVideoById, [_inputs.video_id], function (err, data) {
                        callback(err, data);
                    });
                }

            },
            // 4.퀴즈 보기 그룹(quiz_group) 삭제 (CASCADE 제약으로 함께 삭제된다.)
            // function (callback) {
            //     var query = connection.query(QUERY.COURSE.DeleteQuizGroupByGroupId, [inputs.quiz_group_id], function (err, data) {
            //         console.log(query.sql);
            //         callback(err, data);
            //     });
            // }            
            ], 
            function (err, results) {
                if (err) {
                    console.log(err);
                    // 쿼리 오류
                    return connection.rollback(function() {
                        res.json({
                            success: false,
                            msg: err
                        });
                    });
                } else {
                    connection.commit(function(err) {
                        // 커밋 오류
                        if (err) {
                            return connection.rollback(function() {
                                res.json({
                                    success: false,
                                    msg: err
                                });
                            });
                        }

                        // 커밋 성공
                        return res.json({
                            success: true
                        });
                    });
                }
            }
        );  
    });

});

module.exports = router;