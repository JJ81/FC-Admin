/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict'
require(
  [
    'jquery',
    'common'
  ],
  function ($, Util) {
    var tableCheckAll = $('#check-all')
    // var tableAssignment = Util.initDataTable($('#table_assignment'))
    var tableEmployee = Util.initDataTable($('#table_employee'), {
      'lengthMenu': [ [5, 10, 25, 50, -1], [5, 10, 25, 50, '전체'] ],
      'columnDefs': [
        { orderable: false, targets: [0] }
      ]})
    var btnSubmit = $('.btn-submit')
    var formUpload = $('#frm_upload_file')

    tableCheckAll.bind('click', function () {
      $(':checkbox', tableEmployee.rows().nodes()).prop('checked', this.checked)
    })

    btnSubmit.bind('click', function (e) {
      e.preventDefault()

      if ($("input[name='group_name']").val() === '') {
        alert('그룹명을 입력하세요.')
        $("input[name='group_name']").focus()
        return false
      }

      // validation check2
      if ($("textarea[name='group_desc']").val() === '') {
        alert('그룹 설명을 입력하세요.')
        $("textarea[name='group_desc']").focus()
        return false
      }

      var currentTabId = $('ul.nav li.active').children().attr('id')
      var data = null

      $("input[name='upload_type']").val(currentTabId)

      switch (currentTabId) {
        case 'employee': // 등록된 직원
          data = $(':checkbox:checked', tableEmployee.rows({filter: 'applied'}).nodes()).map(function () {
            return $(this).data('id')
          }).get().join(', ')

          // validation check3
          if (!data) {
            alert('직원을 선택하세요.')
            return false
          }

          $("input[name='upload_employee_ids']").val(data)
          break;

        case 'excel': // 파일업로드
          if (document.getElementById('UploadExcelFile').files.length === 0) {
            $('#UploadExcelFile').focus()
            alert('일을 선택하세요.')
            return false
          }
          break;

        default:
          break;
      }

      formUpload.submit()
    })
  })
