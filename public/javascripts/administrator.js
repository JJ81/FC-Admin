/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
window.requirejs([
  'common'
],
function (Util) {
  var $ = $ || window.$;
  var selectBranchList = window.$('#select-branch-list');
  var branchIdList = [];
  var btnAssignBranch = window.$('.btn-assign-branch');
  var branchContainer = window.$('#draggablePanelList');
  var btnBranchSumit = window.$('.btn-assign-branch-submit');
  var clickedUserId = null;

  var btnOfficeClearInputs = $('.office-right-buttons > #clear-input');
  var btnOfficeSave = $('.office-right-buttons > .btn-submit');
  var btnDeleteOffice = $('#btnDisableOffice');
  var formOffice = $('#frm-regist-office');

  var btnBranchClearInputs = $('.branch-right-buttons > #clear-input');
  var btnBranchSave = $('.branch-right-buttons > .btn-submit');
  var formBranch = $('#frm_create_branch');
  var btnDeleteBranch = $('#btnDisableBranch');
  var dutyList = $('.duty-list > a');
  var btnDutyClearInputs = $('.duty-right-buttons > #clear-input');
  var btnDutySave = $('.duty-right-buttons > .btn-submit');
  var formDuty = $('#frm_create_duty');
  var btnDeleteDuty = $('#btnDisableDuty');
  var tableOfficeBranches;
  var tableAdminOffices;
  var checkAllBranches = $('#check-all-branches');
  var checkAllAdminOffices = $('#check-all-admin-offices');
  var selectOffice = $('#select-office');

  var btnSaveOfficeBranches = $('#btn-save-office-branches');
  var btnSaveAdminOffices = $('#btn-save-admin-offices');

  var selectedAdminId;

  $(function () {
    btnSaveOfficeBranches.prop('disabled', true);
    btnSaveAdminOffices.prop('disabled', true);

    $('#select-branch-list').select2();

    // datatable 설정
    Util.initDataTable($('#table-branch'), { buttons: [] });
    tableOfficeBranches = Util.initDataTable($('#table-office-branches'), {
      'columns': [
        {
          'data': 'active',
          'render': function (data, type, row) {
            if (type === 'display') {
              return '<input type="checkbox" class="editor-active">';
            }
            return data;
          },
          className: 'dt-body-center',
          orderDataType: 'dom-checkbox'
        },
        // { 'data': null, defaultContent: '<input type="checkbox",value="">' },
        { 'data': 'branch_name', className: 'center' },
        { 'data': 'branch_id', className: 'center', visible: false }
      ],
      buttons: [],
      rowCallback: function (row, data) {
        // console.log(row, data);
        if (data.active === 1) {
          window.$('input.editor-active', row).prop('checked', true);
        }
        // window.$('input.editor-active', row).prop('checked', data.active === 1);
      }
    });

    tableAdminOffices = Util.initDataTable($('#table-admin-offices'), {
      'columns': [
        {
          'data': 'active',
          'render': function (data, type, row) {
            if (type === 'display') {
              return '<input type="checkbox" class="editor-active">';
            }
            return data;
          },
          className: 'dt-body-center',
          orderDataType: 'dom-checkbox'
        },
        { 'data': 'office_name', className: 'center' },
        { 'data': 'office_id', className: 'center', visible: false }
      ],
      buttons: [],
      rowCallback: function (row, data) {
        if (data.active === 1) {
          window.$('input.editor-active', row).prop('checked', true);
        }
      }
    });

    Util.initDataTable($('#table_administrator'));
    Util.initDataTable($('#table-office'), { buttons: [] });
  });

  checkAllBranches.bind('click', function () {
    $(':checkbox', tableOfficeBranches.rows().nodes()).prop('checked', this.checked);
  });

  checkAllAdminOffices.bind('click', function () {
    $(':checkbox', tableAdminOffices.rows().nodes()).prop('checked', this.checked);
  });

  btnSaveOfficeBranches.bind('click', function () {
    if (!window.confirm('자료를 저장하시겠습니까?')) return false;

    btnSaveOfficeBranches.prop('disabled', true);

    var checkedBranches =
      $(':checkbox:checked', tableOfficeBranches.rows({filter: 'applied'}).nodes()).map(
        function () {
          return tableOfficeBranches.row(window.$(this).parents('tr')).data()['branch_id'];
        }
      ).get().join(', ');

    window.axios.post('/administrator/office/branches', {
      office_id: selectOffice.val(),
      branch_ids: checkedBranches
    })
    .then(function (res) {
      if (res.data) {
        btnSaveOfficeBranches.prop('disabled', false);
        if (res.data.success !== false) {
          window.alert('자료를 저장하였습니다.');
        } else {
          window.alert('자료를 저장하지 못하였습니다.');
          console.log(res.data.message);
        }
      }
    });
  });

  btnSaveAdminOffices.bind('click', function () {
    if (selectedAdminId == null) return false;
    if (!window.confirm('자료를 저장하시겠습니까?')) return false;

    btnSaveAdminOffices.prop('disabled', true);

    var checkedOffices =
      $(':checkbox:checked', tableAdminOffices.rows({filter: 'applied'}).nodes()).map(
        function () {
          return tableAdminOffices.row(window.$(this).parents('tr')).data()['office_id'];
        }
      ).get().join(', ');

    window.axios.post('/administrator/admin/offices', {
      admin_id: selectedAdminId,
      office_ids: checkedOffices
    })
    .then(function (res) {
      if (res.data) {
        btnSaveAdminOffices.prop('disabled', false);
        if (res.data.success !== false) {
          window.alert('자료를 저장하였습니다.');
        } else {
          window.alert('자료를 저장하지 못하였습니다.');
          console.log(res.data.message);
        }
      }
    });
  });

  selectOffice.change(function () {
    var officeId = $(this).val();

    window.axios.get('/administrator/offices', {
      params: {
        id: officeId
      }
    })
    .then(function (response) {
      var newData = response.data.list;

      if (newData.length > 0) {
        btnSaveOfficeBranches.prop('disabled', false);
        var table = $('#table-office-branches').DataTable();

        table.clear().draw();
        table.rows.add(newData); // Add new data
        table.columns.adjust().draw(); // Redraw the DataTable
      } else {
        btnSaveOfficeBranches.prop('disabled', true);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  });

  $('#assignAdminOffices').on('show.bs.modal', function (e) {
    var $invoker = $(e.relatedTarget);

    selectedAdminId = $invoker.data('user-id');
    selectAdminOffices(selectedAdminId);
  });

  function selectAdminOffices (adminId) {
    window.axios.get('/administrator/admin/offices', {
      params: {
        id: adminId
      }
    })
    .then(function (response) {
      var newData = response.data;
      // console.log(newData);

      if (newData.length > 0) {
        btnSaveAdminOffices.prop('disabled', false);
        var table = $('#table-admin-offices').DataTable();

        table.clear().draw();
        table.rows.add(newData);
        table.columns.adjust().draw();
      } else {
        btnSaveOfficeBranches.prop('disabled', true);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  // 관리자 삭제하기
  window.$('#table_administrator').on('click', '.btn-delete-admin', () => {
    if (!window.confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    const params = {
      id: window.$(this).data('user-id')
    };

    window.axios.delete('/administrator',
      {
        params: params
      })
      .then((response) => {
        if (!response.data.success) {
          window.alert('관리자를 삭제하지 못했습니다.');
        } else {
          window.alert('관리자를 삭제하였습니다.');
        }
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  window.administrator = {
    removeElement: function (el) {
      $(el).parent().parent().remove();
      branchIdList = reCountBranchList();
      return false;
    }
  };

  // 관리자 정보 수정
  window.$('.btn-modify-admininfo').bind('click', (event) => {
    const _self = window.$(event.currentTarget);
    const _name = _self.attr('data-user-name');
    const _email = _self.attr('data-user-email');
    const _role = _self.attr('data-user-role');
    const _action = _self.attr('data-url');
    const _target = window.$('#frm_modify_admin');

    clickedUserId = _self.attr('data-user-id');

    _target.find('#name').val(_name);
    _target.find('#email').val(_email);
    _target.find('.employee_id').val(clickedUserId);
    _target.find('#select_authority').val(_role);
    _target.attr('action', _action);
  });

  // role 수정
  window.$('.btn-modify-role').bind('click', (event) => {
    const _self = window.$(event.currentTarget);
    const _role = _self.attr('data-user-role');
    const _target = window.$('#frm_change_admin_role');

    clickedUserId = _self.attr('data-user-id');

    _target.find('.user_id').val(clickedUserId);
    _target.find('#select_authority').val(_role);
  });

  // supervisor 지점배정
  window.$('.btn-add-branch').bind('click', (event) => {
    const _self = window.$(event.currentTarget);
    const _target = window.$('#frm_assign_branch');

    clickedUserId = _self.attr('data-user-id');
    _target.find('.user_id').val(clickedUserId);

    window.axios({
      method: 'get',
      url: '/administrator/branch/' + clickedUserId
    }).then((res) => {
      if (res.data.success) {
        branchIdList = [];
        branchContainer.empty();

        res.data.list.forEach((obj) => {
          let elem = getItemElement(obj.id, obj.name);
          branchContainer.append(elem);
          branchIdList.push([clickedUserId, obj.id]);
        });
      } else {
        window.alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }
    });
  });

  // 지점 추가
  btnAssignBranch.bind('click', () => {
    const _text = selectBranchList.find('option:selected').text().trim();
    const _id = selectBranchList.find('option:selected').val().trim();

    if (!checkDuplicateBranchId(_id)) {
      const elem = getItemElement(_id, _text);
      branchContainer.append(elem);
      branchIdList.push([clickedUserId, _id]);
    }
  });

  // 지점 템플릿에 데이터를 바인딩 후 반환한다.
  const getItemElement = (branchId, branchName) => {
    return '<li class="list-group-item" data-branch-id="' + branchId + '">' +
      '<div class="course">' + branchName + '<a href="#" class="btn-delete-course" onclick="administrator.removeElement(this);">' +
      ' <i class="fa fa-remove text-red"></i></a>' +
      ' </div>' +
      '</li>';
  };

  // ref. http://www.bootply.com/dUQiGMggWO
  const panelList = window.$('#draggablePanelList');
  panelList.sortable({
    handle: '.course',
    update: () => {
      branchIdList = reCountBranchList();
    }
  });

  // 추가한 강의중에 중복이 있는지 확인을 한다.
  const checkDuplicateBranchId = (id) => {
    for (let i = 0, len = branchIdList.length; i < len; i++) {
      if (branchIdList[i][1] == id) {
        return true;
      }
    }
    return false;
  };

  // 지점 리스트를 다시 점검한다
  const reCountBranchList = () => {
    let _tmp = [];
    window.$('.list-group-item', panelList).each((index, elem) => {
      let _id = [ clickedUserId, window.$(elem).attr('data-branch-id') ];
      _tmp.push(_id);
    });
    return _tmp;
  };

  btnBranchSumit.bind('click', (e) => {
    e.preventDefault();

    // Validation check
    if (branchIdList.length <= 0) {
      window.alert('지점을 추가하세요.');
      return;
    }

    window.axios({
      method: 'post',
      url: '/administrator/assign/branch',
      data: {
        user_id: clickedUserId,
        branch_list: branchIdList
      }
    }).then((res) => {
      if (res.data.success) {
        window.alert('지점을 배정하였습니다.');
      } else {
        console.log(res.data.msg);
        window.alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }

      window.location.reload();
    });
  });

  // 지사 ..등록모드에서 수정모드로 변경
  // 2nd 페이지에서 이벤트 안먹히는 증상 (http://stackoverflow.com/questions/25414778/jquery-onclick-not-working-in-datatables-2nd-page-or-rows-past-11)
  $('#table-office').on('click', '.office-list-item', function (e) {
    e.preventDefault();
    $('.office-input > input[name=\'id\']').val($(this).data('id'));
    $('.office-input > input[name=\'office_name\']').val($(this).data('office-name'));
    $('.office-input > textarea[name=\'office_desc\']').val($(this).data('office-desc'));
    formOffice.attr('action', '/administrator/modify/office');
    btnOfficeSave.html('수정');
    btnDeleteOffice.prop('disabled', false);
  });

  // 지사 .. 수정모드에서 등록모드로 변경
  btnOfficeClearInputs.bind('click', function () {
    $('.office-input > input[name=\'id\']').val('');
    $('.office-input > input[name=\'office_name\']').val('');
    $('.office-input > textarea[name=\'office_desc\']').val('');
    formOffice.attr('action', '/administrator/regist/office');
    btnOfficeSave.html('등록');
    btnDeleteOffice.prop('disabled', true);
  });

  btnDeleteOffice.bind('click', function () {
    if (!window.confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = { id: $('.office-input > input[name=\'id\'').val() };

    window.axios.delete('/administrator/office',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          window.alert('지사를 삭제하지 못했습니다.');
        } else {
          window.alert('지사를 삭제하였습니다.');
        }
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
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
