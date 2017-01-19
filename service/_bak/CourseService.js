/**
 * Created by yijaejun on 03/01/2017.
 */
var QUERY = require('../database/query');
var async = require('async');
var CourseService = {};

/**
 *
 * @param data
 * @returns {Array}
 */
CourseService.makeQuizList = function (rows) {
	// todo 퀴즈 테이블에서 answer 파트에서 어떤 것이 답인지 찾아내는 로직이 필요하다

	var i = 0;
	var __size = rows.length;
	var __tmp_data = []; // 재가공된 데이터를 저장할 공간

	var __tmp_option_id_list = [];
	var __tmp_option = []; // 옵션을 임시로 저장할 공간
	var __pos = 0; // 기록해야 할 포인터 역할

	for(;i<__size;i++){
		if(i === 0){
			__tmp_data.push({
				name : rows[i].name,
				question : rows[i].question
			});

			if(rows[i].answer !== null){
				__tmp_data[__pos].answer = rows[i].answer; // todo 답을 적어 내는 이 부분은 별도의 처리가 필요하다!!
			}else{
				__tmp_data[__pos].answer = rows[i].answer_desc;
			}

			if(rows[i].option !== null){
				__tmp_option.push(rows[i].option);
				// option_id를 일단 수집하자.
				__tmp_option_id_list.push(rows[i].option_id);
			}

		}else{

			if(rows[i-1].id === rows[i].id){
				__tmp_option.push(rows[i].option);
				__tmp_option_id_list.push(rows[i].option_id);
			}else{

				// 답을 갱신한다.
				__tmp_data[__pos].answer = getRealAnswer(__tmp_data[__pos].answer, __tmp_option_id_list);

				__tmp_data[__pos].option = __tmp_option;
				__tmp_option = []; // 다음 질문으로 넘어갈 경우 옵션 저장소를 초기화한다.
				__pos++;

				// 일단 어떤 열이든 다른 질문이라면 무조건 이름과 질문을 입력한다.
				__tmp_data[__pos] = {
					name : rows[i].name,
					question : rows[i].question
				};

				// 답을 입력한다.
				if(rows[i].answer !== null){ // 단답형일 경우
					__tmp_data[__pos].answer = rows[i].answer; // todo 답을 적어 내는 이 부분은 별도의 처리가 필요하다!!
				}else{
					__tmp_data[__pos].answer = rows[i].answer_desc;
				}

				// 선택지가 있을 경우 선택지를 넣기 시작한다.
				if(rows[i].option !== null){
					__tmp_option.push(rows[i].option);
					// option_id를 일단 수집하자.
					__tmp_option_id_list.push(rows[i].option_id);
				}

			}
		}
	}

	return __tmp_data;
};

/**
 * 퀴즈 아이디를 받아서 선택지의 순서상의 번호 즉 답을 리턴한다.
 * @param value
 * @param list
 * @returns {number}
 */
function getRealAnswer(value, list){
	for(var i= 0,len=list.length;i<len;i++){
		// console.log(value + ' / ' + list[i]);
		if(list[i] == value){
			return i+1;
		}
	}
	return null;
}

module.exports = CourseService;