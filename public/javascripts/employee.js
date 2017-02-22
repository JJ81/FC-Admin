/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs([
  'common'
],
function (Util) {
  $(function () {
    $('#createEmployee #select_branch').select2();
    $('#modifyEmployee #select_branch').select2();
  });

  // datatable 설정
  Util.initDataTable($('#table-branch'), {
    buttons: []
  });
  Util.initDataTable($('#table-employee'), {
    buttons:
    [
      {
        text: '<i class="fa fa-copy"></i> 복사',
        extend: 'copy',
        className: 'btn-sm btn-default',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4 ]
        }
      },
      {
        text: '<i class="fa fa-download"></i> 엑셀',
        extend: 'excel',
        className: 'btn-sm btn-default',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4 ]
        }
      }
    ]
  });

  var btnBranchClearInputs = $('.branch-right-buttons > #clear-input');
  var btnBranchSave = $('.branch-right-buttons > .btn-submit');
  var formBranch = $('#frm_create_branch');
  var btnDeleteBranch = $('#btnDisableBranch');
  var dutyList = $('.duty-list > a');
  var btnDutyClearInputs = $('.duty-right-buttons > #clear-input');
  var btnDutySave = $('.duty-right-buttons > .btn-submit');
  var formDuty = $('#frm_create_duty');
  var btnDeleteDuty = $('#btnDisableDuty');

  // 직원정보 수정 페이지
  $('.btn-modify-userinfo').bind('click', function () {
    var _self = $(this);
    var _name = _self.attr('data-user-name');
    var _branch = _self.attr('data-user-branch');
    var _duty = _self.attr('data-user-duty');
    var _phone = _self.attr('data-user-phone');
    var _email = _self.attr('data-user-email');
    var _userid = _self.attr('data-user-id');
    var _target = $('#frm_modify_employee');

    _target.find('#name').val(_name);
    _target.find('#tel').val(_phone);
    _target.find('#email').val(_email);
    _target.find('.employee_id').val(_userid);
    _target.find('#select_branch').val(_branch).trigger('change'); // select2 의 선택방식은 다르다.
    _target.find('#select_duty').val(_duty);
  });

  // 지점 ..등록모드에서 수정모드로 변경
  // 2nd 페이지에서 이벤트 안먹히는 증상 (http://stackoverflow.com/questions/25414778/jquery-onclick-not-working-in-datatables-2nd-page-or-rows-past-11)
  $('#table-branch').on('click', '.branch-list-item', function (e) {
    e.preventDefault();
    $('.branch-input > input[name=\'id\']').val($(this).data('id'));
    $('.branch-input > input[name=\'name\']').val($(this).data('name'));
    formBranch.attr('action', '/employee/modify/branch');
    btnBranchSave.html('수정');
    btnDeleteBranch.prop('disabled', false);
  });

  // 지점 .. 수정모드에서 등록모드로 변경
  btnBranchClearInputs.bind('click', function () {
    $('.branch-input > input[name=\'id\']').val('');
    $('.branch-input > input[name=\'name\']').val('');
    formBranch.attr('action', '/employee/create/branch');
    btnBranchSave.html('등록');
    btnDeleteBranch.prop('disabled', true);
  });

  // 직책 ..등록모드에서 수정모드로 변경
  dutyList.bind('click', function (e) {
    e.preventDefault();
    $('.duty-input > input[name=\'id\'').val($(this).data('id'));
    $('.duty-input > input[name=\'name\']').val($(this).data('name'));
    formDuty.attr('action', '/employee/modify/duty');
    btnDutySave.html('수정');
    btnDeleteDuty.prop('disabled', false);
  });

  // 직책 .. 수정모드에서 등록모드로 변경
  btnDutyClearInputs.bind('click', function () {
    $('.duty-input > input[name=\'id\']').val('');
    $('.duty-input > input[name=\'name\']').val('');

    formDuty.attr('action', '/employee/create/duty');
    btnDutySave.html('등록');
    btnDeleteDuty.prop('disabled', true);
  });

  // 직원 삭제하기
  $('#table-employee').on('click', '.btn-delete-employee', function () {
    if (!confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: $(this).data('user-id')
    };

    axios.delete('/employee',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          alert('직원을 삭제하지 못했습니다.');
        } else {
          alert('직원을 삭제하였습니다.');
        }
        location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // 지점 삭제하기
  btnDeleteBranch.bind('click', function () {
    if (!confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: $('.branch-input > input[name=\'id\'').val()
    };

    axios.delete('/employee/branch',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          alert('지점을 삭제하지 못했습니다.');
        } else {
          alert('지점을 삭제하였습니다.');
        }
        location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // 직책 삭제하기
  btnDeleteDuty.bind('click', function () {
    if (!confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: $('.duty-input > input[name=\'id\'').val()
    };

    axios.delete('/employee/duty',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          alert('직책을 삭제하지 못했습니다.');
        } else {
          alert('직책을 삭제하였습니다.');
        }
        location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
