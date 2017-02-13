/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
        'common',
	],
	function (Util) {

        $(function() {
            tinymce.init({
                selector: '.course-desc'
            });
        });

        Util.initDataTable($('#table_course'));

        var _teachers = $('.teacher-list > a'),
            _branches = $('.branch-list > a'),
            _duties = $('.duty-list > a'),

            _btn_teacher_clear_inputs = $('.teacher-right-buttons > #clear-input'),
            _btn_branch_clear_inputs = $('.branch-right-buttons > #clear-input'),
            _btn_duty_clear_inputs = $('duty-right-buttons > #clear-input'),

            _btn_teacher_save = $('.teacher-right-buttons > .btn-submit'),
            _btn_branch_save = $('.branch-right-buttons > .btn-submit'),
            _btn_duty_save = $('.duty-right-buttons > .btn-submit'),

            _form_teacher = $('#frm_create_teacher'),
            _form_branch = $('#frm_create_branch'),
            _form_duty = $('#frm_create_duty');
        
        // 강사 ..등록모드에서 수정모드로 변경
        _teachers.bind('click', function(e) {

            e.preventDefault();

            $("input[name='id'").val($(this).data('id'));
            $("input[name='teacher'").val($(this).data('name'));
            $("textarea[name='teacher_desc'").val($(this).data('desc'));

            _form_teacher.attr('action', '/course/modify/teacher');
            _btn_teacher_save.html('수정');
            
        });

        // 강사 ..수정모드에서 등록모드로 변경
        _btn_teacher_clear_inputs.bind('click', function () {
            
            $("input[name='id'").val('');
            $("input[name='teacher'").val('');
            $("textarea[name='teacher_desc'").val('');

            _form_teacher.attr('action', '/course/create/teacher');
            _btn_teacher_save.html('등록');

        });           

	}); // end of func