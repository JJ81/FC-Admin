/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
define(
	[
		'jquery'
        ,'jquery_datatable'
		,'bootstrap_datatable'
        ,'responsive_datatable'
	],
	function ($) {
		// info 공통 로직은 이곳에서 정의한다.

		// show modal to reset password
		$('.btn-modify-password').bind('click', function () {
			$('#frm_set_employee_password .user_id').val($(this).attr('data-user-id'));
			$('#frm_set_employee_password .user_name').val($(this).attr('data-user-name'));
			$('#frm_set_employee_password').attr('action', $(this).attr('data-url'));
		});  

		var validation = {};

		return {
            initDataTable: function (element) {
                element.DataTable({
                    responsive: true,
                    language: {            
                        "url": "https://cdn.datatables.net/plug-ins/1.10.13/i18n/Korean.json"
                        // "url": "/datatable.kr.json"
                    },
                    "order": [[ 0, '' ]],
                });
            },           
			createWindowPopup: function(url, title, option) {
				window.open(url, title, option);
			}
		};
	}); // end of func