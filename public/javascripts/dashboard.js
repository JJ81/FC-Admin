/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		'jquery',
        'axios',
        'common',
		'moment',
		'excellentExport',
		'bootstrap',
		'jquery_datatable',
		'bootstrap_datatable',
		'select2',
		'daterangepicker',
		'jquery_ui',
		'adminLTE',
		'fastclick',	
	],
	function ($, axios, Util) {

		// todo 위의 기능중에서 유틸성 기능은 common으로 이동시킨다.
		// 여기서부터 포인트 환산 모달 컴퍼넌트를 위한 로직

        $.widget.bridge('uibutton', $.ui.button);

        // datatable 설정
        Util.initDataTable($('#table_point'));

		var
			_total = 0,
			frm_point_weight = $('#frm_point_weight'),
			pointWeightForm = $('#pointWeight'),
			eduComplete = $('.eduComplete'),
			quizComplete = $('.quizComplete'),
			finalComplete = $('.finalComplete'),
			reeltimeComplete = $('.reeltimeComplete'),
			speedComplete = $('.speedComplete'),
			repsComplete = $('.repsComplete'),
			totalPoint = $('.total_point'),
			btnRegisterPointWeight = $('.btn-register-point-weight');
        
        /**
         * 포인트 상세내역 모달창
         * 
         */        
        $('#modal-point-details').on('show.bs.modal', function (e) {
            
            axios.get('/dashboard/point/details', {
                params: {
                    user_id: $(e.relatedTarget).data('user-id')
                }
            })
            .then(function (response) {
                console.log(response.data.list);

                var point_complete = $('.eduComplete').val(),
                    point_speed = $('.speedComplete').val(),
                    point_reeltime = $('.reeltimeComplete').val(),
                    point_quiz = $('.quizComplete').val(),
                    point_final = $('.finalComplete').val(),
                    point_repeat = $('.repeat').val();

                $("#table_point_details > tbody ").html('');

                var list = response.data.list, element = "";            
                for (var index = 0; index < list.length; index++) {
                    
                    element = '<tr>';
                    element += '<td>' + list[index].edu_name + '</td>';
                    element += '<td class="center">' + list[index].edu_start_dt + ' ~ ' + list[index].edu_end_dt + '</td>';
                    element += '<td class="center">' + list[index].complete.complete_course_count + ' / ' + list[index].complete.total_course_count + '</td>';
                    element += '<td class="center">' + list[index].quiz_correction.correct_count + ' / ' + list[index].quiz_correction.total_count + '</td>';
                    element += '<td class="center">' + list[index].final_correction.correct_count + ' / ' + list[index].final_correction.total_count + '</td>';
                    element += '<td class="center">' + list[index].reeltime.played_seconds + ' / ' + list[index].reeltime.duration + '</td>';
                    element += '<td class="center">' + list[index].speed.user_period + ' / ' + list[index].speed.edu_period + '</td>';
                    element += '<td class="center">' + (list[index].repetition.value == 1 ? '예' : '아니오') + '</td>';

                    var point_sum = 
                        list[index].complete.value * point_complete +
                        list[index].speed.value * point_speed +
                        list[index].reeltime.value * point_reeltime +
                        list[index].quiz_correction.value * point_quiz +
                        list[index].final_correction.value * point_final +
                        list[index].repetition.value * point_repeat;

                    element += '<td class="center">' + point_sum.toFixed(2) + '</td>';
                    element += '</tr>';
                    $("#table_point_details > tbody ").append(element);
                }
            })
            .catch(function (error) {
                console.error(error);
            });
        });

		// 설정값을 저장하려고 할 때 전체 값을 가져와서 합산이 100이 떨어지지 않을 경우 에러 메시지를 띄운다.
		btnRegisterPointWeight.bind('click', function (e){
			e.preventDefault();
			var _total = calculateTotalWeight();
			console.log('total : ' + _total);
			if(_total !== 100){
				alert('총 설정값을 다시 확인해 주세요');
				return;
			}

			// alert('submit');
			frm_point_weight.submit();
		});


		// 숫자가 입력되지 않았을 경우 경고창을 띄워준다.
		pointWeightForm.find('input').bind('blur', function () {
			var _val = $(this).val();
			validateEveryInput($(this));
			totalPoint.html(calculateTotalWeight());
		});


		// input value 초기화
		pointWeightForm.find('input').each(function (index, elem){
			var _val = $(elem).val();
			if(_val === ''){
				$(elem).val(0);
				_total = 0;
			}
			_total += parseInt($(elem).val());
			totalPoint.html(_total);
		});


		// calculate totalPoint
		pointWeightForm.find('input').bind('keydown', function (e) {
			// block from insert dot character
			if(e.keyCode === 190 || e.keyCode === 13){
				return false;
			}

			totalPoint.html(calculateTotalWeight());
		});


		// input값을 돌면서 합산을 내는 함수를 별도로 제작한다.
		function calculateTotalWeight(){
			var _total = 0;
			pointWeightForm.find('input').each(function (index, elem){
				_total += parseInt($(elem).val());
			});
			return _total;
		}

		/**
		 * 엘리먼트에 설정된 값을 규칙에 맞게 수정을 한다.
		 * @param elem
		 */
		function validateEveryInput(elem){
			var _val = elem.val();

			console.log('validation : ' + _val);

			if(_val == 0 && _val.length >= 1){
				console.log('check zero');
				$(elem).val(0);
			}

			if(_val.length >= 3){
				alert('허용 범위를 넘었습니다.');
				elem.val(0);
			}

			if(_val === ''){
				elem.val(0);
			}

			// 숫자 앞에 0이 있을 경우 앞의 0을 자동으로 제거해준다
			if(_val.split('')[0] === '0'){
				var _tmp = _val.split(''); // 뽑아낸 것을 리턴한다.
				var _len = _tmp.length;

				if(_len >= 2){
					_val = _val.slice(1,_len);
				}

				elem.val(_val);
			}
		}


	}); // end of func