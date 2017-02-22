/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs([
  'common'
],
function (Util) {
  // datatable 설정
  Util.initDataTable($('#table_admin'),
    {
      buttons:
      [
        {
          text: '<i class="fa fa-copy"></i> 복사',
          extend: 'copy',
          className: 'btn-sm btn-default',
          exportOptions: {
            columns: [ 0, 1, 2, 3 ]
          }
        },
        {
          text: '<i class="fa fa-download"></i> 엑셀',
          extend: 'excel',
          className: 'btn-sm btn-default',
          exportOptions: {
            columns: [ 0, 1, 2, 3 ]
          }
        }
      ]
    });

  var selectBranchList = $('.select-branch-list');
  var branchIdList = [];
  var btnAssignBranch = $('.btn-assign-branch');
  var branchContainer = $('#draggablePanelList');
  var btnBranchSumit = $('.btn-assign-branch-submit');
  var clickedUserId = null;

  // 관리자 삭제하기
  $('#table_admin').on('click', '.btn-delete-admin', function () {
    if (!confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: $(this).data('user-id')
    };

    axios.delete('/administrator',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          alert('관리자를 삭제하지 못했습니다.');
        } else {
          alert('관리자를 삭제하였습니다.');
        }
        location.reload();
      })
      .catch(function (error) {
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
  $('.btn-modify-admininfo').bind('click', function () {
    var _self = $(this);
    var _name = _self.attr('data-user-name');
    var _email = _self.attr('data-user-email');
    var _role = _self.attr('data-user-role');
    var _action = _self.attr('data-url');
    var _target = $('#frm_modify_admin');

    clickedUserId = _self.attr('data-user-id');

    _target.find('#name').val(_name);
    _target.find('#email').val(_email);
    _target.find('.employee_id').val(clickedUserId);
    _target.find('#select_authority').val(_role);
    _target.attr('action', _action);
  });

  // role 수정
  $('.btn-modify-role').bind('click', function () {
    var _self = $(this);
    var _role = _self.attr('data-user-role');
    var _target = $('#frm_change_admin_role');

    clickedUserId = _self.attr('data-user-id');

    _target.find('.user_id').val(clickedUserId);
    _target.find('#select_authority').val(_role);
  });

      // supervisor 지점배정
  $('.btn-add-branch').bind('click', function () {
    var _self = $(this);
    var _target = $('#frm_assign_branch');

    clickedUserId = _self.attr('data-user-id');
    _target.find('.user_id').val(clickedUserId);

    axios({
      method: 'get',
      url: '/administrator/branch/' + clickedUserId
    }).then(function (res) {
      if (res.data.success) {
        branchIdList = [];
        branchContainer.empty();

        res.data.list.forEach(function (obj) {
          var elem = getItemElement(obj.id, obj.name);
          branchContainer.append(elem);
          branchIdList.push([clickedUserId, obj.id]);
        });
      } else {
        alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }
    });
  });

  // 지점 추가
  btnAssignBranch.bind('click', function () {
    var _text = selectBranchList.find('option:selected').text().trim();
    var _id = selectBranchList.find('option:selected').val().trim();

    if (!checkDuplicateBranchId(_id)) {
      var elem = getItemElement(_id, _text);
      branchContainer.append(elem);
      branchIdList.push([clickedUserId, _id]);
    }
  });

  // 지점 템플릿에 데이터를 바인딩 후 반환한다.
  function getItemElement (branchId, branchName) {
    return '<li class="list-group-item" data-branch-id="' + branchId + '">' +
          '	<div class="course">' + branchName + '<a href="#" class="btn-delete-course" onclick="administrator.removeElement(this);">' +
          '	  <i class="fa fa-remove text-red"></i></a>' +
          '	</div>' +
          '</li>';
  }

  // ref. http://www.bootply.com/dUQiGMggWO
  var panelList = $('#draggablePanelList');
  panelList.sortable({
    handle: '.course',
    update: function () {
      branchIdList = reCountBranchList();
    }
  });

  // 추가한 강의중에 중복이 있는지 확인을 한다.
  function checkDuplicateBranchId (id) {
    for (var i = 0, len = branchIdList.length; i < len; i++) {
      if (branchIdList[i][1] == id) {
        return true;
      }
    }
    return false;
  }

  // 지점 리스트를 다시 점검한다
  function reCountBranchList () {
    var _tmp = [];
    $('.list-group-item', panelList).each(function (index, elem) {
      var _id = [ clickedUserId, $(elem).attr('data-branch-id') ];
      _tmp.push(_id);
    });
    return _tmp;
  }

  btnBranchSumit.bind('click', function (e) {
    e.preventDefault();

    // Validation check
    if (branchIdList.length <= 0) {
      alert('지점을 추가하세요.');
      return;
    }

    axios({
      method: 'post',
      url: '/administrator/assign/branch',
      data: {
        user_id: clickedUserId,
        branch_list: branchIdList
      }
    }).then(function (res) {
      if (res.data.success) {
        alert('지점을 배정하였습니다.');
      } else {
        console.log(res.data.msg);
        alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }

      window.location.reload();
    });
  });
}); // end of func
