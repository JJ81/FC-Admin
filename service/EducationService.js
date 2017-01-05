/**
 * Created by yijaejun on 03/01/2017.
 */
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');

var _count_info = 0;
var _count_size = 0;
var _error = [];

// todo 롤백이 일어나지 않는 문제가 있다.
const EducationService = {
	addCourseList : function (group_id, course_list, cb) {
		if(_count_info === 0){
			_count_size =	course_list.length;
		}

		connection.query(QUERY.EDU.InsertCourseGroup,
			[
				group_id,
				course_list[_count_info]
			],
			function (err, result) {
				if(err){
					console.error('EducationService:addCourseList ' + err);
					_error.push(err);
					callback(err, null);
				}

				if(_count_info < _count_size-1){
					_count_info++;
					EducationService.addCourseList(group_id, course_list, cb);
				}else{
					cb(null, result);
				}
			});
	}
};


module.exports = EducationService;