const QUERY = require('../database/query');
const async = require('async');
const pool = require('../commons/db_conn_pool');
const util = require('../util/util');
var CourseService = {};

/**
 * 강의를 비활성화 한다.
 * _id: course 테이블의 id
 */
exports.deactivateById = (_id, _callback) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.COURSE.DisableCourseById, [_id], (err, data) => {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * 강사를 비활성화 한다.
 * _id: teacher 테이블의 id
 */
exports.deactivateTeacherById = (_id, _callback) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(QUERY.COURSE.DisableTeacherById, [_id], (err, data) => {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * 퀴즈 보기를 입력/수정한다.
 */
exports.InsertOrUpdateQuizOptions = (_connection, _data, _callback) => {
  CourseService.connection = _connection;
  async.each(_data, saveQuizOption, (err, data) => {
    _callback(err, data);
  });
};

/**
 * 퀴즈 보기를 입력/수정을 수행하는 내부함수
 *
 * @param {object} option
 * @param {any} callback
 * data.id 가 있을 경우 수정모드, 없을 경우 입력모드이다.
 */
const saveQuizOption = (data, callback) => {
  if (data.id) {
    // 수정
    CourseService.connection.query(QUERY.COURSE.UpdateQuizOption,
      [
        data.option,
        data.iscorrect,
        data.order,
        data.id
      ],
      (err, data) => {
        callback(err, data); // results[1]
      }
    );
  } else {
    // 입력
    CourseService.connection.query(QUERY.COURSE.CreateQuizOption, data, (err, data) => {
      callback(err, data); // results[1]
    });
  }
};

/**
 * 체크리스트를 입력/수정한다.
 */
exports.InsertOrUpdateChecklist = (_connection, _data, _callback) => {
  CourseService.connection = _connection;

  if (!_data.course_list_id) {
    let checklistGroupId = util.publishHashByMD5('orangenamu');

    async.series([
      (callback) => {
        CourseService.connection.query(QUERY.COURSE.InsertCourseListForChecklist, [
          _data.course_id,
          'CHECKLIST',
          _data.title,
          checklistGroupId,
          _data.course_id
        ],
        (err, data) => {
          if (data.insertId) {
            _data.course_list_id = data.insertId;
            _data.checklist_group_id = checklistGroupId;
            CourseService.data = _data;
          }
          callback(err, data);
        });
      },
      (callback) => {
        async.each(_data.data, saveChecklist, (err, data) => {
          callback(err, data);
        });
      }
    ],
    (err, results) => {
      _callback(err, results);
    });
  } else {
    CourseService.data = _data;
    async.series([
      (callback) => {
        CourseService.connection.query(QUERY.COURSE.UpdateSessionTitle,
          [
            _data.title,
            _data.course_list_id
          ],
          (err, data) => {
            callback(err, data);
          }
        );
      },
      (callback) => {
        async.each(_data.data, saveChecklist, (err, data) => {
          callback(err, data);
        });
      }
    ],
    (err, results) => {
      _callback(err, results);
    });
  }
};

/**
 * 체크리스트를 입력/수정한다.
 * data.id 가 있을 경우 수정모드, 없을 경우 입력모드이다.
 */
const saveChecklist = (_data, _callback) => {
  if (_data.id) {
    // 수정
    CourseService.connection.query(QUERY.COURSE.UpdateChecklist,
      [
        _data.item_name,
        _data.item_type,
        _data.item_section,
        _data.sample,
        _data.id
      ],
      (err, data) => {
        if (err) {
          console.error(err);
        }
        _callback(err, data);
      }
    );
  } else {
    // 입력
    async.waterfall([
      (callback) => {
        // checklist Insert
        CourseService.connection.query(QUERY.COURSE.InsertChecklist,
          [
            _data.item_name,
            _data.item_type,
            _data.item_section,
            _data.sample
          ],
          (err, data) => {
            callback(err, data);
          }
        );
      },
      (checklist, callback) => {
        // checklist_group Insert
        CourseService.connection.query(QUERY.COURSE.InsertOrUpdateChecklistGroup,
          [
            CourseService.data.checklist_group_id,
            checklist.insertId,
            _data.order,
            _data.order
          ],
          (err, data) => {
            callback(err, data);
          });
      }
    ], (err, results) => {
      if (err) throw err;
      _callback(err, results);
    });
  }
};

/**
 * 퀴즈리스트를 가공한다.
 */
exports.makeQuizList = (quizList) => {
  let quizId = null;
  let returnList = [];

  // 데이터를 가공한다.
  // 퀴즈 별도 obj 로 분리.
  // 보기 array 형태로 퀴즈별로 할당
  quizList.forEach((quiz) => {
    if (quizId !== quiz.quiz_id) {
      var quizdata = {};

      switch (quiz.quiz_type) {
      case 'A': // 단답형
        quizdata = {
          type: quiz.type,
          quiz_id: quiz.quiz_id,
          quiz_type: quiz.quiz_type,
          question: quiz.question,
          answer: quiz.answer_desc,
          order: quiz.quiz_order
        };
        break;

      case 'B': // 선택형
      case 'C': // 다답형
        quizdata = {
          type: quiz.type,
          quiz_id: quiz.quiz_id,
          quiz_type: quiz.quiz_type,
          question: quiz.question,
          answer: [],
          order: quiz.quiz_order,
          option_group_id: quiz.option_group_id,
          options: []
        };

        var optiondata = quizList.filter((data) => {
          return data.quiz_id === quiz.quiz_id && data.option !== null;
        });

        if (optiondata) {
          for (var index = 0; index < optiondata.length; index++) {
            var option = optiondata[index];

            if (option.iscorrect) {
              quizdata.answer.push(option.option);
            }

            quizdata.options.push({
              id: option.option_id,
              opt_id: option.option_group_id,
              option: option.option,
              iscorrect: option.iscorrect,
              order: option.option_order
            });
          }

          quizdata.answer = quizdata.answer.join(', ');
        }
        break;
      default:
        break;
      }

      // 마지막 quiz_id 를 임시 저장한다.
      quizId = quiz.quiz_id;
      // 퀴즈를 리스트에 입력한다.
      returnList.push(quizdata);
    }
  });

  return returnList;
};

// module.exports = CourseService;
