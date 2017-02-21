/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
  [
    'common'
  ],
function (Util) {
  var teacherList = $('.teacher-list > a');
  var btnTeacherClearInputs = $('.teacher-right-buttons > #clear-input');
  var btnTeacherSave = $('.teacher-right-buttons > .btn-submit');
  var btnTeacherDisable = $('#btnDisableTeacher');
  var formTeacher = $('#frm_create_teacher');

  $(function () {
    Util.initDataTable($('#table_course'));
  });

    // 강사 ..등록모드에서 수정모드로 변경
  teacherList.bind('click', function (e) {
    e.preventDefault();

    $("input[name='id'").val($(this).data('id'));
    $("input[name='teacher'").val($(this).data('name'));
    $("textarea[name='teacher_desc'").val($(this).data('desc'));

    formTeacher.attr('action', '/course/modify/teacher');
    btnTeacherSave.html('수정');
    btnTeacherDisable.prop('disabled', false);
  });

  // 강사 ..수정모드에서 등록모드로 변경
  btnTeacherClearInputs.bind('click', function () {
    $("input[name='id'").val('');
    $("input[name='teacher'").val('');
    $("textarea[name='teacher_desc'").val('');

    formTeacher.attr('action', '/course/create/teacher');
    btnTeacherSave.html('등록');
    btnTeacherDisable.prop('disabled', true);
  });

  btnTeacherDisable.bind('click', function () {
    if (!confirm("강사를 삭제하시겠습니까?")) {
      return false;
    }

    var params = {
      id: $("input[name='id'").val()
    };

    axios.delete('/course/teacher', {
      params: params
    })
    .then(function (res) {
      if (!res.data.success) {
        alert("강사를 삭제하지 못했습니다. 관리자에게 문의하세요.");
      } else {
        alert('강사를 삭제하였습니다.');
      }
      location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
  });
});