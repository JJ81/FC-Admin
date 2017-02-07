/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		// 'jquery'
		// ,'moment'
		// ,'excellentExport'
        'common',
		// ,'bootstrap'
		// ,'jquery_datatable'
		// ,'bootstrap_datatable'
		// ,'select2'
		// ,'daterangepicker'
		// ,'jquery_ui'
		// ,'adminLTE'
		// ,'fastclick'		
	],
	function (Util) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		// $.widget.bridge('uibutton', $.ui.button);

		// $(".select2").select2();

		//// Download csv
		//$('.btn_download_csv_home').bind('click', function (){
		//	return excellentCsv.csv(this, 'table_home', ',');
		//});
		//


		// datatable 설정
		var table_employee =
        Util.initDataTable($('#table_employee'));


		// 직원정보 수정 페이지
		$('.btn-modify-userinfo').bind('click', function () {
			var _self = $(this);
			var _name = _self.attr('data-user-name');
			var _branch = _self.attr('data-user-branch');
			var _duty = _self.attr('data-user-duty');
			var _phone = _self.attr('data-user-phone');
			var _email = _self.attr('data-user-email');
			var _user_id = _self.attr('data-user-id');

			var _target = $('#frm_modify_employee');
			_target.find('#name').val(_name);
			_target.find('#tel').val(_phone);
			_target.find('#email').val(_email);
			_target.find('.employee_id').val(_user_id);
			_target.find('#select_branch').val(_branch);
			_target.find('#select_duty').val(_duty);
		});




		//
		//table_home
		//	.column( '0:visible' )
		//	.order( 'desc' )
		//	.draw();
		//
		//// select box
		//// $(".select2").select2();
		//
		//// datepicker
		//$('#daterange-btn').daterangepicker({
		//	ranges: {
		//		'Today': [moment(), moment()],
		//		'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		//		'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		//		'Last 30 Days': [moment().subtract(30, 'days'), moment()],
		//		'This Month': [moment().startOf('month'), moment().endOf('month')],
		//		'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		//	},
		//	startDate: moment().subtract(30, 'days'),
		//	endDate: moment()
		//},
		//function (start, end) {
		//	//$('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		//	$('#daterange-btn span').html(start.format('YYYY.M.D') + ' - ' + end.format('YYYY.M.D'));
		//});
		//
		//// Implement with datatables's API
		//$('.realSelectBox').bind('change', function () {
		//	var _self = $(this);
		//	var val = _self.val();
		//	if(_self.val() === 'Any Type'){
		//		val = '';
		//	}
		//	table_home.columns( 1 ).search(val).draw();
		//});
		//
		//
		//// Filtering with date
		//$('.daterangepicker .ranges li, .daterangepicker .applyBtn').bind('click', function () {
		//	if($(this).text().trim() === 'Custom Range'){
		//		return;
		//	}
		//
		//	setTimeout(function () {
		//		var date = $('.filter_date').text();
		//
		//		date = date.split('-');
		//		console.info(date);
		//
		//		$('#startDate').val(date[0].trim());
		//		$('#endDate').val(date[1].trim());
		//
		//		$('.filterWithDate').submit();
		//
		//	}, 100);
		//});
		//
		//// daterangepicker의 액션을 제어하기 귀찮아서 액티브를 제거한다.
		//
		//$('#daterange-btn').bind('click', function () {
		//	$('.daterangepicker .ranges li').removeClass('active');
		//	$('.daterangepicker .ranges').bind('mouseover', function () {
		//		$('.daterangepicker .ranges li').removeClass('active');
		//	})
		//});



	}); // end of func