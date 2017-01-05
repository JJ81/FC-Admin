/**
 * Created by yijaejun on 03/01/2017.
 */
var mysql_dbc = require('../commons/db_conn')();
var connection = mysql_dbc.init();
var bcrypt = require('bcrypt');
const QUERY = require('../database/query');
const DEFAULT_PASSWORD = '0000';

var _count_info = 0;
var _count_size = 0;
var _error = [];
const RegisterUserService = {
	createUser: function (user_info, fc_id, cb) {
		var _info = user_info[_count_info];

		if(_count_info === 0){
			_count_size =	user_info.length;
		}

		connection.query(QUERY.EMPLOYEE.CreateEmployee,
			[
				_info.name,
				bcrypt.hashSync(DEFAULT_PASSWORD, 10),
				_info.email,
				_info.phone,
				fc_id,
				_info.duty_code,
				_info.branch_code
			],
			function (err, result) {
				if(err){
					console.error('RegisterUserService : ' + err);
					_error.push(err);
				}

				if(_count_info < _count_size-1){
					_count_info++;
					RegisterUserService.createUser(user_info, fc_id, cb);
				}else{
					cb(_error, result);
				}

		});
	}
};

module.exports = RegisterUserService;