/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		// 'jquery',
        // 'axios',
        'common',
		// 'moment',
		// 'excellentExport',
		// 'bootstrap',
		// 'jquery_datatable',
		// 'bootstrap_datatable',
		// 'select2',
		// 'daterangepicker',
		// 'jquery_ui',
		// 'adminLTE',
		// 'fastclick',	
        // 'es6-promise',
	],
	function (Util) {

        // https://github.com/stefanpenner/es6-promise 참고
        // require('es6-promise').polyfill();

		// todo 위의 기능중에서 유틸성 기능은 common으로 이동시킨다.
		// 여기서부터 포인트 환산 모달 컴퍼넌트를 위한 로직

        // $.widget.bridge('uibutton', $.ui.button);

        $(function () {

            // datatable 설정            
            
            // 교육과정별 포인트 현황
            Util.initDataTable($('#table-point-by-edu'), { 
                responsive: true,
                language: { "url": "https://cdn.datatables.net/plug-ins/1.10.13/i18n/Korean.json" },          
                "columns": [
                    { "data": "branch_name", className: "center" },
                    { "data": "duty_name", className: "center" },
                    { "data": "user_name", className: "center" },
                    { "data": "period", className: "center" },
                    { "data": "complete", className: "center" },
                    { "data": "quiz_correction", className: "center" },
                    { "data": "final_correction", className: "center" },
                    { "data": "reeltime", className: "center" },
                    { "data": "speed", className: "center" },
                    { "data": "repetition", className: "center" },
                    { "data": "point_total", className: "right" },
                ],
                "order": [[ 10, 'desc' ]],
            });            

            // 누적 포인트 현황
            Util.initDataTable($('#table_point'), { 
                responsive: true,
                language: { "url": "https://cdn.datatables.net/plug-ins/1.10.13/i18n/Korean.json" },    
                "order": [[ 3, 'desc' ]],                             
            });

        });

        // 교육과정 선택 변경
        $('#select-point-by-edu').change(function () {

            var edu_id = $(this).val();
            axios.get('/dashboard/edupoint', {
                params: {
                    edu_id: edu_id
                }
            })
            .then(function (response) {
                var new_data = response.data.data,
                    table = $('#table-point-by-edu').DataTable();
                
                // console.info(new_data);

                table.clear().draw();
                table.rows.add(new_data); // Add new data
                table.columns.adjust().draw(); // Redraw the DataTable                
            })
            .catch(function (error) {
                console.error(error);
            });
        });

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
                // console.log(response.data.list);

                // var point_complete = $('.eduComplete').val(),
                //     point_speed = $('.speedComplete').val(),
                //     point_reeltime = $('.reeltimeComplete').val(),
                //     point_quiz = $('.quizComplete').val(),
                //     point_final = $('.finalComplete').val(),
                //     point_repeat = $('.repeat').val();

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
                        list[index].complete.value * list[index].point_complete +
                        list[index].quiz_correction.value * list[index].point_quiz +
                        list[index].final_correction.value * list[index].point_final +
                        list[index].reeltime.value * list[index].point_reeltime +                        
                        list[index].speed.value * list[index].point_speed +                        
                        list[index].repetition.value * list[index].point_repetition;

                    element += '<td class="center">' + point_sum.toFixed(2) + '</td>';
                    element += '</tr>';
                    $("#table_point_details > tbody ").append(element);
                }
            })
            .catch(function (error) {
                console.error(error);
            });
        });            

	}); // end of func