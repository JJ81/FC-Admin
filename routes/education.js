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
const async = require('async');
const EducationService = require('../service/EducationService');

/**
 * 교육과정괸리 첫페이지
 */
router.get('/', isAuthenticated, function (req, res) {

	async.series(
		[
			function (callback) {
				connection.query(QUERY.EDU.GetList, [req.user.fc_id], function (err, rows) {
					if(err){
						console.error(err);
						callback(err, null);
					}else{
						callback(null, rows);
					}
				});
			},
			function (callback) {
				connection.query(QUERY.EDU.GetCourseList, [req.user.fc_id], function (err, rows) {
					if(err){
						console.error(err);
						callback(err, null);
					}else{
						callback(null, rows);
					}
				});
			}
		],
		function (err, result) {
			if(err){
				console.error(err);
			}else{

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

	// var _course_group_id = req.query.course_group_id;
    var _params = req.query;

    async.series([

        // results[0]: 교육과정정보를 조회한다.
        function (callback) {
            connection.query(QUERY.EDU.GetEduInfoById, [ _params.id ], function (err, data) {
                callback(err, data); 
            });
        },
        // results[1]: 교육과정의 강의목록을 조회한다.
        function (callback) {
            connection.query(QUERY.EDU.GetCourseListByGroupId, [ _params.course_group_id ], function (err, data) {
                callback(err, data);
            });
        },
        // results[2]: 전체 강의목록을 조회한다.
        function (callback) {
            connection.query(QUERY.EDU.GetCourseList, [ req.user.fc_id ], function (err, data) {
                callback(err, data);
            });
        }        
    ], function (err, results) {
        if (err) {
            console.error(err);
        } else {
            console.info(results[0][0]);

            res.render('education_details', {
                current_path: 'EducationDetails',
                menu_group: 'education',
                title: PROJ_TITLE + 'Education Details',
                loggedIn: req.user,
                edu: results[0][0],
                edu_course_list: results[1],
                course_list: results[2]
            });            
        }
    });    
        
	
    // connection.query(QUERY.EDU.GetCourseListByGroupId,
	// 	[_course_group_id],
	// 	function (err, rows) {
	// 		if(err){
	// 			console.error(err);
	// 		}else{
    //             console.log(rows);
	// 			res.render('education_details', {
	// 				current_path: 'EducationDetails',
	// 				title: PROJ_TITLE + 'Education Details',
	// 				loggedIn: req.user,
	// 				list: rows
	// 			});
	// 		}
	// });
});

/**
 * 교육과정을 등록한다.
 */
router.post('/create/edu', isAuthenticated, function (req, res) {
	
    var _data = {};
	_data.group_id = req.body.course_group_id.trim();
	_data.course_name = req.body.course_name.trim();
	_data.course_desc = req.body.course_desc.trim();
	_data.course_list = req.body.course_list;
	_data.creator_id = req.user.admin_id;
    _data.start_dt = req.body.start_dt;
    _data.end_dt = req.body.end_dt;

	console.info(_data);

	connection.beginTransaction(function () {
		async.series(
			[
				function (callback) {
					connection.query(QUERY.EDU.InsertEdu, [
						_data.course_name, _data.course_desc, _data.group_id, _data.creator_id, _data.start_dt, _data.end_dt
					], function (err, result) {
						if(err){
							console.error(err);
							callback(err, null);
						}else{
							console.info('check!');
							console.info(result);
							callback(null, result);
						}
					});
				},

				function (callback) {
					EducationService.addCourseList(_data.group_id, _data.course_list,
						function (err, result) {
							if(err){
								callback(null, null);
							}else{
								console.info(result);
								callback(null, result);
							}
						});
				}

			],
			function (err, result) {
				if(err) {
					console.error(err);
					console.log('rollback');
					// todo 롤백를 일어나서 데이터 유출이 있을 수도 있다
					connection.rollback();
					res.json({
						success : false
					});
				}else{
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

    // console.log (_inputs);
    // return res.json({
    //     success: true
    // });

	connection.beginTransaction(function () {
		async.series(
			[
                // 교육과정을 수정한다.
				function (callback) {
					connection.query(QUERY.EDU.UpdateEdu, [
						_inputs.name, 
                        _inputs.desc,  
                        _inputs.start_dt, 
                        _inputs.end_dt,
                        _inputs.id
					], function (err, result) {
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
				if(err) {
					console.error(err);
					connection.rollback();
					return res.json({
						success : false
					});
				}else{
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
        if (err) 
            res.json({ success: false, msg: err }); 
        else 
            res.json({ success: true });
    });
    

});

module.exports = router;