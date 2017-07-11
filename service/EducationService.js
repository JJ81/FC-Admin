/**
 * Created by yijaejun on 03/01/2017.
 */
// const mysql_dbc = require('../commons/db_conn')();
// const connection = mysql_dbc.init();
const pool = require('../commons/db_conn_pool');
const QUERY = require('../database/query');
var async = require('async');
var EducationService = {};

EducationService.deactivateById = function (_id, _callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(QUERY.EDU.DisableEduById, [_id], function (err, data) {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * todo
 * 순서를 받아야 한다.
 */
EducationService.addCourseList = function (group_id, course_list, cb) {
  var _count_info = 0;
  var _count_size = 0;
  var _error = [];

  if (_count_info === 0) {
    _count_size = course_list.length;
  }

  connection.query(QUERY.EDU.InsertCourseGroup, [
    group_id,
    course_list[_count_info],
    0
  ],
    function (err, result) {
      if (err) {
        console.error('EducationService:addCourseList ' + err);
        _error.push(err);
        callback(err, null);
      }

      if (_count_info < _count_size - 1) {
        _count_info++;
        EducationService.addCourseList(group_id, course_list, cb);
      } else {
        // result를 모아서 던질 수 있어야 하나?
        // todo 마지막 result를 던지지 말고 모든 result를 담아서 객체를 던지든가 아니면 true값만 던진다.
        cb(null, result);
      }
    }
  );
};

/**
 * 강의그룹을 입력/수정한다.
 */
EducationService.InsertOrUpdateCourseGroup = function (connection, data, callback) {
  EducationService.connection = connection;
  async.each(data, executeCourseGroup, function (err, data) {
    callback(err, data);
  });
};

/**
 * 강의그룹을 입력/수정/삭제한다.
 *
 * @param {json} data
 * @param {function} callback
 */
function executeCourseGroup (data, callback) {
  var _query = null;

  if (data.mode === 'DELETE') {
    _query =
      EducationService.connection.query(QUERY.EDU.DeleteCourseGroup, [
        data.id
      ],
        function (err, data) {
          console.log(_query.sql);
          callback(err, data);
        }
      );
  } else if (data.mode === 'UPDATE') {
    _query =
      EducationService.connection.query(QUERY.EDU.UpdateCourseGroup, [
        data.order,
        data.id
      ],
        function (err, data) {
          console.log(_query.sql);
          callback(err, data);
        }
      );
  } else if (data.mode === 'INSERT') {
    _query =
      EducationService.connection.query(QUERY.EDU.InsertCourseGroup, [
        data.course_group_id,
        data.course_id,
        data.order
      ],
        function (err, data) {
          console.log(_query.sql);
          callback(err, data);
        }
      );
  }
}

module.exports = EducationService;
