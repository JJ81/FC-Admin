/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
		// 'jquery',
		// 'moment',
	    // 'excellentExport',
        'common',
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
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		// $.widget.bridge('uibutton', $.ui.button);
        // datatable 설정
        Util.initDataTable($('#table_course'));
        // https://github.com/stefanpenner/es6-promise 참고
        // require('es6-promise').polyfill(); 

        var _teachers = $('.teacher-list > a'),
            _btn_clear_inputs = $('#clear-input'),
            _btn_save = $('.btn-set-agent-password-submit'),
            _form = $('#frm_create_teacher');
        
        // 등록모드에서 수정모드로 변경
        _teachers.bind('click', function(e) {

            e.preventDefault();

            $("input[name='id'").val($(this).data('id'));
            $("input[name='teacher'").val($(this).data('name'));
            $("textarea[name='teacher_desc'").val($(this).data('desc'));

            _form.attr('action', '/course/modify/teacher');
            _btn_save.html('수정');
            
        });

        // 수정모드에서 등록모드로 변경
        _btn_clear_inputs.bind('click', function () {
            
            $("input[name='id'").val('');
            $("input[name='teacher'").val('');
            $("textarea[name='teacher_desc'").val('');

            _form.attr('action', '/course/create/teacher');
            _btn_save.html('등록');

        });

	}); // end of func