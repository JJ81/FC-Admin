/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
define(
	[
		'jquery'
	],
	function ($) {

		// info 공통 로직은 이곳에서 정의한다.



		// todo 공통로직으로 변경할 것.
		// show modal (reset password)
		$('.btn-modify-password').bind('click', function () {
			$('#frm_set_employee_password .user_id').val($(this).attr('data-user-id'));
			$('#frm_set_employee_password .user_name').val($(this).attr('data-user-name'));
			$('#frm_set_employee_password').attr('action', $(this).attr('data-url'));
		});




	}); // end of func