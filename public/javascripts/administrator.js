/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
window.requirejs([
  'common'
],
function (Util) {
  // datatable 설정
  Util.initDataTable($('#table_administrator'));

  const selectBranchList = window.$('.select-branch-list');
  let branchIdList = [];
  const btnAssignBranch = window.$('.btn-assign-branch');
  const branchContainer = window.$('#draggablePanelList');
  const btnBranchSumit = window.$('.btn-assign-branch-submit');
  let clickedUserId = null;

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
      if (branchIdList[i][1] === id) {
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
});
