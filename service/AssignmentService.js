
var QUERY = require('../database/query'),
    async = require('async'),
    Util = require('../util/util'),
    AssignmentService = {};

/**
 * _data.upload_type 이 'excel' 일 경우
 * user 를 먼저 생성한다음 user_id를 취득한 후 아래 단계를 진행한다.
 * 
 * 1. log_group_user 생성
 * 2. log_bind_users 생성
 */
AssignmentService.create = function (_connection, _data, _callback) {

    var _count = 0,
        _group_id = Util.publishHashByMD5(new Date()),
        _user_ids = [];
    
    console.log(_data);

    _connection.beginTransaction(function(err) {

        // 트렌젝션 오류 발생
        if (err) _callback(err, null);

        switch (_data.upload_type) {
            case 'excel':
                _connection.query(QUERY.EDU.GetUserDataByPhone, [ _data.excel ], function (err, data) {
                    console.log(data);

                    if (data.length == 0) {
                        _callback(null, null);
                        return;
                    }

                    for (var index = 0; index < data.length; index++) {
                        _user_ids.push(data[index].id);
                    }

                    async.whilst(
                        function() { return _count < _user_ids.length; },
                        function(callback) {
                            _connection.query(QUERY.EDU.InsertIntoLogGroupUser, 
                                [ _user_ids[_count], _group_id ],
                                function (err, data) {
                                    callback(err, null);  
                                }
                            );
                            _count++;
                        },
                        function (err, data) {
                            if (err) {
                                console.log('----------------------------');
                                console.log('error:InsertIntoLogGroupUser');
                                console.error(err);
                                return _connection.rollback(function() {
                                    _callback(err, null);
                                    return;
                                });     
                            }

                            _connection.query(QUERY.EDU.InsertIntoLogBindUser,
                                [
                                    _data.group_name,
                                    _data.group_desc,
                                    _data.admin_id,
                                    _group_id
                                ],
                                function (err, result) {
                                    if (err) {
                                        console.log('----------------------------');
                                        console.log('error:InsertIntoLogBindUser');
                                        console.error(err);
                                        return _connection.rollback(function() {
                                            _callback(err, null);
                                            return;
                                        });     
                                    } else {
                                        _connection.commit(function(err) {
                                            if (err) {
                                                return _connection.rollback(function() {
                                                    _callback(err, null);
                                                    return;
                                                });
                                            } else {
                                                console.log('commit success!');
                                                _callback(null, null);
                                            }                                    
                                        });                                    
                                    }
                                });
                        }
                    );                  

                    // console.log(_user_ids.length);                   
                });
                break;

            case 'employee':
                if (_data.upload_employee_ids.length == 0) {
                    _callback(null, null);
                    return;
                }

                _user_ids = _data.upload_employee_ids.slice(0);
                async.whilst(
                    function() { return _count < _user_ids.length; },
                    function(callback) {
                        _connection.query(QUERY.EDU.InsertIntoLogGroupUser, 
                            [ _user_ids[_count], _group_id ],
                            function (err, data) {
                                callback(err, null);  
                            }
                        );
                        _count++;
                    },
                    function (err, data) {
                        if (err) {
                            console.log('----------------------------');
                            console.log('error:InsertIntoLogGroupUser');
                            console.error(err);
                            return _connection.rollback(function() {
                                _callback(err, null);
                                return;
                            });     
                        }

                        _connection.query(QUERY.EDU.InsertIntoLogBindUser,
                            [
                                _data.group_name,
                                _data.group_desc,
                                _data.admin_id,
                                _group_id
                            ],
                            function (err, result) {
                                if (err) {
                                    console.log('----------------------------');
                                    console.log('error:InsertIntoLogBindUser');
                                    console.error(err);
                                    return _connection.rollback(function() {
                                        _callback(err, null);
                                        return;
                                    });     
                                } else {
                                    _connection.commit(function(err) {
                                        if (err) {
                                            return _connection.rollback(function() {
                                                _callback(err, null);
                                                return;
                                            });
                                        } else {
                                            console.log('commit success!');
                                            _callback(null, null);
                                        }                                    
                                    });                                    
                                }
                            });
                    }
                );                
                break;        
        
            default:
                break;
        }       

    });
};

module.exports = AssignmentService;