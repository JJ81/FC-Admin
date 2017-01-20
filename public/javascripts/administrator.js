/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs([
		'jquery',
		'axios',
        'common',
		'moment',
		'excellentExport',
		'bootstrap',
		'jquery_datatable',
		'bootstrap_datatable',
		// 'select2',
		// 'daterangepicker',
		'jquery_ui',
		'adminLTE',
		'fastclick',
	],
	function ($, axios, Util) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);

        // datatable 설정
        Util.initDataTable($('#table_admin'));        

		var select_branch_list = $('.select_branch_list');
		var branchIdList = [];		        
		var btn_assign_branch = $('.btn-assign-branch');
		var _branch_container = $('#draggablePanelList');
		var _submit = $('.btn-assign-branch-submit');
		var _user_id = null;

		window.administrator = {
			removeElement : function (el) {
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

			_user_id = _self.attr('data-user-id');

			_target.find('#name').val(_name);
			_target.find('#email').val(_email);
			_target.find('.employee_id').val(_user_id);
			_target.find('#select_authority').val(_role);
			_target.attr('action', _action);
		});

		// role 수정
		$('.btn-modify-role').bind('click', function () {
			var _self = $(this);			
			var _role = _self.attr('data-user-role');
			var _target = $('#frm_change_admin_role');

			_user_id = _self.attr('data-user-id');

			_target.find('.user_id').val(_user_id);
			_target.find('#select_authority').val(_role);
		});
        
        // supervisor 지점배정
		$('.btn-add-branch').bind('click', function () {
			var _self = $(this);
			var _target = $('#frm_assign_branch');

			_user_id = _self.attr('data-user-id');
			_target.find('.user_id').val(_user_id);

			axios({
				method : 'get',
				url: '/administrator/branch/' + _user_id
			}).then(function (res){
				if (res.data.success) {

					branchIdList = [];
					_branch_container.empty();

					res.data.list.forEach(function (obj) { 
						var elem = getItemElement(obj.id, obj.name);						
						_branch_container.append(elem);
						branchIdList.push([_user_id, obj.id]);
					});

				} else {
					alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
				}
			});				
		});

		// 지점 추가
		btn_assign_branch.bind('click', function () {

			var _text = select_branch_list.find('option:selected').text().trim();
			var _id = select_branch_list.find('option:selected').val().trim();

			if(!checkDuplicateBranchId(_id)){
				var elem = getItemElement(_id, _text);
				_branch_container.append(elem);
				branchIdList.push([_user_id, _id]);
			}

		});
		
		// 지점 템플릿에 데이터를 바인딩 후 반환한다. 
		function getItemElement(branch_id, branch_name) {

			return  '<li class="list-group-item" data-branch-id="' + branch_id + '">' +
                    '	<div class="course">' + branch_name + '<a href="#" class="btn-delete-course" onclick="administrator.removeElement(this);">' +
                    '		<i class="fa fa-remove text-red"></i></a>' +
                    '	</div>' +
                    '</li>';

		}

		// ref. http://www.bootply.com/dUQiGMggWO
		var panelList = $('#draggablePanelList');
		panelList.sortable({
			handle: '.course',
			update: function() {
				branchIdList = reCountBranchList();
			}
		});

		// 추가한 강의중에 중복이 있는지 확인을 한다.
		function checkDuplicateBranchId(id){
			for (var i = 0, len = branchIdList.length; i < len; i++){
				if(branchIdList[i][1] == id){
					return true;
				}
			}
			return false;
		}

		// 지점 리스트를 다시 점검한다
		function reCountBranchList(){
			var _tmp = [];
			$('.list-group-item', panelList).each(function(index, elem) {
				var _id = [ _user_id, $(elem).attr('data-branch-id') ];
				_tmp.push(_id);
			});
			return _tmp;
		}                         
		
		_submit.bind('click', function (e) {

			e.preventDefault();

			// Validation check
			if(branchIdList.length <= 0){
				alert('지점을 추가하세요.');
				return;
			}

			axios({
				method : 'post',
				url: '/administrator/assign/branch',
				data : {
					user_id: _user_id,
					branch_list : branchIdList
				}
			}).then(function (res){
				if(res.data.success){
					alert('지점을 배정하였습니다.');
				}else{
					console.log(res.data.msg);
					alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
				}

				window.location.reload();

			});			


		});

	}); // end of func