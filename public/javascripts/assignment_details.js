/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		'jquery'
        ,'common'
		,'moment'
		,'excellentExport'
		,'bootstrap'
		,'jquery_datatable'
		,'bootstrap_datatable'
		,'select2'
		,'daterangepicker'
		,'jquery_ui'
		,'adminLTE'
		,'fastclick'		
	],
	function ($, Util) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);

		var btnAssignEducation = $('.btn-assign-education');
		btnAssignEducation.bind('click', function () {
			$('#allocationEdu .user_group_id').val($('.description .group_id').val());
			$('#allocationEdu .bind_group_id').val($('.description .bind_group_id').val());
		});

        // datatable 설정
        Util.initDataTable($('#table_assignment_details'));        

	}); // end of func