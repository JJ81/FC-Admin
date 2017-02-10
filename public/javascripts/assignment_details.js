/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
        'common',
	],
	function (Util) {

		var btnAssignEducation = $('.btn-assign-education'),
            btnDeleteAssignment = $('#delete-assignment');

        $(function () {
            // datatable 설정
            Util.initDataTable($('#table_assignment_details'));
        });

		btnAssignEducation.bind('click', function () {
			$('#allocationEdu .user_group_id').val($('.description.group_id').val());
			$('#allocationEdu .bind_group_id').val($('.description.bind_group_id').val());
		});

        btnDeleteAssignment.bind('click', function () {

            if (!confirm("교육배정그룹을 삭제하시겠습니까?"))
                return false;

            var params = {
                id: $(this).data('id'),
                group_id: $(this).data('group-id')
            };
            
            axios.delete('/assignment', {
                params: params
            })
            .then(function (res) {
                if (!res.data.success) {
                    alert("배정된 교육과정이 있어 삭제하지 못했습니다. 관리자에게 문의해주세요.");                    
                } else {
                    alert("교육생 그룹을 삭제하였습니다.");
                    location.href = "/assignment";
                }                
            })
            .catch(function (error) {
                console.log(error);
            });                        
            
        });

	}); // end of func