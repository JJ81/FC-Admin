/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
	[
        'common',		
	],
	function (Util) {

        var _table_check_all = $('#check-all'),
            _table_assingment = Util.initDataTable($('#table_assignment')),
            _table_employee = Util.initDataTable($('#table_employee'), { 
                "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "전체"] ],
                "columnDefs": [
                    { orderable: false, targets: [0] }
                ],            
            }),
            _btn_submit = $('.btn-submit'),
            _form = $('#frm_upload_file'); 
                
        _table_check_all.bind('click', function () {
            $(':checkbox', _table_employee.rows().nodes()).prop('checked', this.checked);
        });
        
        _btn_submit.bind('click', function (e) {

            e.preventDefault();
            
            // validation check1
            if ($("input[name='group_name']" ).val() === '') {
                alert("그룹명을 입력하세요.");
                $( "input[name='group_name']" ).focus();
                return false;
            } 

            // validation check2
            if ($("textarea[name='group_desc']" ).val() === '') {
                alert("그룹 설명을 입력하세요.");
                $( "textarea[name='group_desc']" ).focus();
                return false;
            }             

            var current_tab_id = $("ul.nav li.active").children().attr('id'),
                data = null;      

            $("input[name='upload_type']").val(current_tab_id);

            switch (current_tab_id) {
                case "employee": // 등록된 직원
                    data = $(':checkbox:checked', _table_employee.rows({filter: 'applied'}).nodes()).map(function () {                        
                        return $(this).data('id');
                    }).get().join(", ");

                    // validation check3
                    if (!data) {
                        alert("직원을 선택하세요.");
                        return false;
                    }

                    console.log(data);
                    $("input[name='upload_employee_ids']").val(data);
                                           
                    break;

                case "excel": // 파일업로드

                    // validation check3
                    if( document.getElementById("UploadExcelFile").files.length == 0 ){
                        $('#UploadExcelFile').focus();
                        alert("파일을 선택하세요.");
                        return false;
                    }
                    break;

                default:
                    break;
            }

            _form.submit();

        }); 
        
	}); // end of func