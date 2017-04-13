const QUERY = require('../database/query');
const async = require('async');

/**
 * 교육과정별 강의별 이수율을 조회한다.
 */
exports.getCourseProgress = (connection, data, callback) => {
  this.connection = connection;
  async.each(data, getEduCourseProgress, (err, results) => {
    callback(err, data);
  });
};

/**
 * 교육과정마다의 강의 이수율을 조회하여 기존 데이터에 추가한다.
 *
 * @param {any} data
 * @param {any} callback
 */
const getEduCourseProgress = (data, callback) => {
  this.connection.query(QUERY.DASHBOARD.GetCourseProgressByEduId,
    [
      data.fc_id, data.edu_id, data.edu_id
    ],
    (err, result) => {
      data.course = result;
      callback(err, data);
    }
  );
};
