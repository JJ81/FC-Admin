/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(['common'],
function (Util) {
  var btnAssignEducation = $('.btn-assign-education');
  var btnDeleteAssignment = $('#delete-assignment');
  var formRegistAssignment = $('#allocationEdu');
  var formModifyAssignment = $('#modifyAssignment');

  $(function () {
    // DateTimePicker 설정
    Util.initDateTimePicker(
      formRegistAssignment.find('#start_dt'),
      formRegistAssignment.find('#end_dt')
    );
    Util.initDateTimePicker(
      formModifyAssignment.find('#start_dt'),
      formModifyAssignment.find('#end_dt')
    );
    // datatable 설정
    Util.initDataTable($('#table_assignment_details'));
    Util.initDataTable($('#table_assignment_history'));
  });

  btnAssignEducation.bind('click', function () {
    $('#allocationEdu .user_group_id').val($('.description.group_id').val());
    $('#allocationEdu .bind_group_id').val($('.description.bind_group_id').val());
  });

  btnDeleteAssignment.bind('click', function () {
    if (!confirm('교육생 그룹을 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: $(this).data('id'),
      group_id: $(this).data('group-id')
    };

    axios.delete('/assignment', {
      params: params
    })
    .then(function (res) {
      if (!res.data.success) {
        alert('교육생 그룹을 삭제하지 못했습니다. 관리자에게 문의하세요.');
      } else {
        alert('교육생 그룹을 삭제하였습니다.');
      }
      location.href = '/assignment';
    })
    .catch(function (error) {
      console.log(error);
    });
  });

  // 배정이력 삭제하기
  $('#table_assignment_history').on('click', '.btn-delete-assignment', function () {
    if (!confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: $(this).data('logassigneduid')
    };

    axios.delete('/assignment_history',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          alert('배정이력을 삭제하지 못했습니다.');
        } else {
          alert('배정이력을 삭제하였습니다.');
        }
        location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  $('.btn-modify-assignment').bind('click', function () {
    var form = $('#modifyAssignment');

    form.find('.user_group_id').val($('.description.group_id').val());
    form.find('.bind_group_id').val($('.description.bind_group_id').val());
    form.find('#start_dt').datetimepicker().children('input').val($(this).data('start'));
    form.find('#end_dt').datetimepicker().children('input').val($(this).data('end'));
    form.find('#log_assign_edu_id').val($(this).data('logassigneduid'));
    form.find('#eduName').html($(this).data('eduname'));
  });
});
