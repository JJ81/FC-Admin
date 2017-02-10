/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
        'common',
	],
	function (Util) {

		// datatable 설정
		var table_employee = Util.initDataTable($('#table_employee'), 
            {
             buttons: 
                [
                    {
                        text: '<i class="fa fa-copy"></i> 복사',
                        extend: "copy",
                        className: "btn-sm btn-default",
                        exportOptions: {
                            columns: [ 0, 1, 2, 3, 4 ]
                        }
                    },                            
                    {
                        text: '<i class="fa fa-download"></i> 엑셀',
                        extend: "excel",
                        className: "btn-sm btn-default",
                        exportOptions: {
                            columns: [ 0, 1, 2, 3, 4 ]
                        }
                    }                    
                ]
            });

        var _branches = $('.branch-list > a'),            
            _btn_branch_clear_inputs = $('.branch-right-buttons > #clear-input'),
            _btn_branch_save = $('.branch-right-buttons > .btn-submit'),
            _form_branch = $('#frm_create_branch'),
            _duties = $('.duty-list > a'),
            _btn_duty_clear_inputs = $('.duty-right-buttons > #clear-input'),
            _btn_duty_save = $('.duty-right-buttons > .btn-submit'),            
            _form_duty = $('#frm_create_duty');


		// 직원정보 수정 페이지
		$('.btn-modify-userinfo').bind('click', function () {
			var _self = $(this),
                _name = _self.attr('data-user-name'),
                _branch = _self.attr('data-user-branch'),
                _duty = _self.attr('data-user-duty'),
                _phone = _self.attr('data-user-phone'),
                _email = _self.attr('data-user-email'),
                _user_id = _self.attr('data-user-id'),
                _target = $('#frm_modify_employee');

			_target.find('#name').val(_name);
			_target.find('#tel').val(_phone);
			_target.find('#email').val(_email);
			_target.find('.employee_id').val(_user_id);
			_target.find('#select_branch').val(_branch);
			_target.find('#select_duty').val(_duty);
		});

        // 지점 ..등록모드에서 수정모드로 변경
        _branches.bind('click', function(e) {

            e.preventDefault();

            $(".branch-input > input[name='id']").val($(this).data('id'));
            $(".branch-input > input[name='name']").val($(this).data('name'));

            _form_branch.attr('action', '/employee/modify/branch');
            _btn_branch_save.html('수정');
            
        });

        // 지점 .. 수정모드에서 등록모드로 변경
        _btn_branch_clear_inputs.bind('click', function () {
            
            $(".branch-input > input[name='id']").val('');
            $(".branch-input > input[name='name']").val('');

            _form_branch.attr('action', '/employee/create/branch');
            _btn_branch_save.html('등록');

        });    

        // 직책 ..등록모드에서 수정모드로 변경
        _duties.bind('click', function(e) {

            e.preventDefault();

            $(".duty-input > input[name='id'").val($(this).data('id'));
            $(".duty-input > input[name='name']").val($(this).data('name'));

            _form_duty.attr('action', '/employee/modify/duty');
            _btn_duty_save.html('수정');
            
        });

        // 직책 .. 수정모드에서 등록모드로 변경
        _btn_duty_clear_inputs.bind('click', function () {
            
            $(".duty-input > input[name='id']").val('');
            $(".duty-input > input[name='name']").val('');

            _form_duty.attr('action', '/employee/create/duty');
            _btn_duty_save.html('등록');

        });          

	}); // end of func