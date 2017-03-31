var QUERY = require('../database/query');
var async = require('async');
var DashboardService = {};

/**
 * 교육과정별 강의별 이수율을 조회한다.
 */
DashboardService.getCourseProgress = function (connection, data, callback) {
  DashboardService.connection = connection;
  async.each(data, getEduCourseProgress, function (err, results) {
    callback(err, data);
  });
};

/**
 * 교육과정마다의 강의 이수율을 조회하여 기존 데이터에 추가한다.
 *
 * @param {any} data
 * @param {any} callback
 */
function getEduCourseProgress (data, callback) {
    // console.log('edu_id : ' + data.edu_id);
  var _query = null;
  _query =
        DashboardService.connection.query(QUERY.DASHBOARD.GetCourseProgressByEduId, [
          data.fc_id, data.edu_id, data.edu_id
        ],
            function (err, result) {
              data.course = result; // <-- 기존 데이터에 추가
              callback(err, data);
            }
        );
}

module.exports = DashboardService;
