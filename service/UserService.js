/**
 * Created by yijaejun on 03/01/2017.
 */
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const UserService = {};
const QUERY = require('../database/query');
const async = require('async');
var bcrypt = require('bcrypt');
const pool = require('../commons/db_conn_pool');

/**
 * 관리자를 비활성화 한다.
 * _id: users 테이블의 id
 */
UserService.deactivateAdminById = function (_id, _callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(QUERY.ADMIN.DisableAdminById, [_id], function (err, data) {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * 직원을 비활성화 한다.
 * _id: users 테이블의 id
 */
UserService.deactivateEmployeeById = function (_id, _callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(QUERY.EMPLOYEE.DisableEmployeeById, [_id], function (err, data) {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * 지점을 비활성화 한다.
 * _id: branch 테이블의 id
 */
UserService.deactivateBranchById = function (_id, _callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(QUERY.EMPLOYEE.DisableBranchById, [_id], function (err, data) {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * 직책을 비활성화 한다.
 * _id: duty 테이블의 id
 */
UserService.deactivateDutyById = function (_id, _callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(QUERY.EMPLOYEE.DisableDutyById, [_id], function (err, data) {
      connection.release();
      if (err) throw err;
      _callback(err, null);
    });
  });
};

/**
 * 차례대로 핸드폰 정보만 모두 추출하여 배열에 넣고 한번의 조회를 통하여 얻은 데이터를
 * user_id만 다시 배열에 넣어서 리턴한다.
 * @param list
 * @param cb
 */
UserService.extractUserIdFromList = function (list, cb) {
  var user_id = [];
  var phone = [];

  for (var i = 0, len = list.length; i < len; i++) {
    phone.push('0' + list[i].phone.toString());
  }

  connection.query(QUERY.EDU.GetUserDataByPhone, [ phone ], function (err, rows) {
    if (err) {
      cb(err, null);
    } else {
      console.info('extract userId');
      console.info(rows);

			// todo 여기서 rows 데이터를 돌면서 user_id만 추출하여 user_id 배열에 넣어서 리턴한다.
      if (rows.length < 0) {
        cb(null, null);
      } else {
        for (var j = 0, len2 = rows.length; j < len2; i++) {
          user_id.push(rows[j].id);
        }

        console.info('return user_id array');
        console.info(user_id);

        cb(null, user_id);
      }

				// for(var j= 0, len2=rows.length; j<len2 ;j++){
				//	user_id.push(rows[j].id);
				// }
				//
				// console.info('return user_id array');
				// console.info(user_id);
				//
				// cb(null, user_id);
    }
  });
};

/**
 * user_id 배열을 받아서 돌면서 db에 insert를 수행
 * @param user_id
 * @param cb
 */
var __pointer = 0;
var __sizeOfUserId = 0;
UserService.insertUserDataInGroupUser = function (user_id, group_id, cb) {
  if (__pointer === 0) {
    __sizeOfUserId = user_id.length;
  }

  connection.query(QUERY.EDU.InsertIntoLogGroupUser,
		[user_id[__pointer], group_id],
		function (err, result) {
  if (err) {
    console.error(err);
  } else {
				// 다음 항목으로 넘어간다.
    if (__pointer < __sizeOfUserId - 1) {
      __pointer++;
      UserService.insertUserDataInGroupUser(user_id, group_id, cb);
    } else {
					// 에러를 수집하여 리턴하지는 않는다. 나중에 해야 하나 고려할 필요성은 있겠다.
      cb(null, true);
    }
  }
});
};

/**
 * 그룹 아이디를 통해서 log_group_user 테이블에서 유저를 추출한 후에 user_id만 배열에 담아서 리턴한다.
 * @param group_id
 * @param cb
 */
UserService.extractUserIdByGroupId = function (group_id, cb) {
  connection.query(QUERY.EDU.GetUserListByGroupId, [group_id], function (err, rows) {
    if (err) {
      cb(err, null);
    } else {
      var __size = rows.length;
      var __user_id = [];
      for (var i = 0; i < __size; i++) {
        __user_id.push(rows[i].id);
      }

      cb(null, __user_id);
    }
  });
};

/**
 * 리턴받은 유저 아이디를 edu_id와 함께 training_users 테이블에 입력한다.
 * @param user_id
 * @param trainig_edu_id
 * @param cb
 * @constructor
 */
var __userSize = 0;
var __pointer = 0;
var __error = [];
UserService.InsertUsersWithTrainingEduId = function (user_id, training_edu_id, cb) {
  if (__pointer === 0) {
    __userSize = user_id.length;
  }

  console.log('try to insert user data in training users : ' + training_edu_id);

  connection.query(QUERY.EDU.InsertUserIdInTrainingUsers,
		[user_id[__pointer], training_edu_id],
		function (err, result) {
  if (err) {
    console.error(err);
    __error.push(err);
  }

  if (__pointer < __userSize - 1) {
    __pointer++;
    UserService.InsertUsersWithTrainingEduId(user_id, training_edu_id, cb);
  } else {
				// todo 결과값을 모두 받아서 던저야 하나? 트랜잭션 처리가 그래야 안전하게 되는지 알아봐야 한다.
    cb(null, true);
  }
});
};

/**
 * 엑셀업로드로 직원을 생성한다.
 */
UserService.createUserByExcel = function (_connection, _data, _callback) {
  var _count = 0,
    _excel_data = _data.excel_data,
    _user = _data.user;

    // console.log(_data.excel_data);
    // _callback(null, null);
    // return;

  _connection.beginTransaction(function (err) {
        // 트렌젝션 오류 발생
    if (err) _callback(err, null);

    async.whilst(
            function () { return _count < _excel_data.length; },
            function (callback) {
                // console.log(_excel_data[_count].name + " 입력 중..");

                // 오류가 있는 엑셀 데이터는 레코드 자체를 미입력
              if (_excel_data[_count].error) {
                _count++;
                callback(null, null);
              } else {
                UserService.createBranchOrSelect(_connection, _excel_data[_count].branch, _user.fc_id, function (err, branch_id) {
                  UserService.createDutyOrSelect(_connection, _excel_data[_count].duty, _user.fc_id, function (err, duty_id) {
                            // console.log(branch_id);
                            // console.log(duty_id);
                    var query = _connection.query(QUERY.EMPLOYEE.CreateEmployee,
                      [
                        _excel_data[_count].name,
                        bcrypt.hashSync(_excel_data[_count].phone.slice(-4), 10), // 휴대폰번호 뒤 4자리를 초기 비밀번호로 한다.
                        _excel_data[_count].email,
                        _excel_data[_count].phone,
                        _user.fc_id,
                        duty_id,
                        branch_id
                      ],
                                function (err, data) {
                                  console.log(query.sql);
                                  if (err) console.log(err);
                                    // 다음 엑셀 데이터를 읽기 위해 카운터를 증가시킨다.
                                  _count++;
                                  callback(err, null);
                                }
                            );
                  });
                });
              }
            },
            // async.whilst 의 최종 callback
            function (err, data) {
              if (err) {
                console.error(err);
                return _connection.rollback(function () {
                  _callback(err, null);
                  return;
                });
              } else {
                _connection.commit(function (err) {
                  if (err) {
                    return _connection.rollback(function () {
                      _callback(err, null);
                      return;
                    });
                  } else {
                    console.log('commit success!');
                    _callback(null, null);
                  }
                });
              }
            }
        );
  });
};

UserService.createBranchOrSelect = function (_connection, _branch, _fc_id, _callback) {
    // console.log('branch select or insert ..');
  _connection.query(QUERY.EMPLOYEE.CreateBranch,
    [ _branch, _fc_id ],
    function (err, data) {
      if (err) console.log(err);
      if (data.insertId) {
        _callback(err, data.insertId);
      } else {
            // 이미 존재하는 지점일 경우 기존 지점 ID 를 조회한다.
        _connection.query(QUERY.EMPLOYEE.GetBranchByName,
            [ _fc_id, _branch ],
            function (err, data) {
              _callback(err, data[0].id);
            });
      }
    });
};

UserService.createDutyOrSelect = function (_connection, _duty, _fc_id, _callback) {
    // console.log('duty select or insert ..');
  _connection.query(QUERY.EMPLOYEE.CreateDuty,
    [ _duty, _fc_id ],
    function (err, data) {
      if (err) console.log(err);
      if (data.insertId) {
        _callback(err, data.insertId);
      } else {
            // 이미 존재하는 직책일 경우 기존 직책 ID 를 조회한다.
        _connection.query(QUERY.EMPLOYEE.GetDutyByName,
            [ _fc_id, _duty ],
            function (err, data) {
              _callback(err, data[0].id);
            });
      }
    });
};

module.exports = UserService;
