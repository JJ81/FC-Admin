/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs(
  [
    'common'
  ],
function (Util) {
  var $ = $ || window.$;
  $(function () {
    // Util.test();

    // datatable 설정
    Util.initDataTable($('#table-point-by-edu'), {
      'columns': [
        { 'data': 'branch_name', className: 'center' },
        { 'data': 'duty_name', className: 'center' },
        { 'data': 'user_name', className: 'center' },
        { 'data': 'period', className: 'center' },
        { 'data': 'complete', className: 'center' },
        { 'data': 'quiz_correction', className: 'center' },
        { 'data': 'final_correction', className: 'center' },
        { 'data': 'reeltime', className: 'center' },
        { 'data': 'speed', className: 'center' },
        { 'data': 'repetition', className: 'center' },
        { 'data': 'point_total', className: 'right' }
      ],
      'order': [[ 10, 'desc' ]]
    });
    // 누적 포인트 현황
    Util.initDataTable($('#table_point'), {
      'order': [[ 3, 'desc' ]],
      buttons: [
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
  });

  // 교육과정 선택 변경
  $('#select-point-by-edu').change(function () {
    var table = $('#table-point-by-edu').DataTable();

    if ($(this).prop('selectedIndex') === 0) {
      table.clear().draw();
      return false;
    }
    var eduId = $(this).val();

    axios.get('/dashboard/edupoint', {
      params: {
        edu_id: eduId
      }
    })
    .then(function (response) {
      var newData = response.data.data;
      // var table = $('#table-point-by-edu').DataTable();

      table.clear().draw();
      table.rows.add(newData); // Add new data
      table.columns.adjust().draw(); // Redraw the DataTable
    })
    .catch(function (error) {
      console.error(error);
    });
  });

  /**
   * 포인트 상세내역 모달창
   *
   */
  $('#modal-point-details').on('show.bs.modal', function (e) {
    axios.get('/dashboard/point/details', {
      params: {
        user_id: $(e.relatedTarget).data('user-id')
      }
    })
    .then(function (response) {
      $('#table_point_details > tbody ').html('');
      var list = response.data.list;
      var element = '';
      var period;
      var days;

      for (var index = 0; index < list.length; index++) {
        element = '<tr>';
        element += '<td>' + list[index].edu_name + '</td>';

        if (list[index].edu_start_dt === null) {
          period = '시작전';
        } else if (list[index].edu_end_dt === null) {
          period = list[index].edu_start_dt + ' ~ ' + '미완료';
        } else {
          period = list[index].edu_start_dt + ' ~ ' + list[index].edu_end_dt;
        }

        days = list[index].speed.user_period === null ? 0 : list[index].speed.user_period;
        element += '<td class="center">' + period + '</td>';
        // element += '<td class="center">' + list[index].edu_start_dt + ' ~ ' + list[index].edu_end_dt + '</td>';
        element += '<td class="center">' + list[index].complete.complete_course_count + ' / ' + list[index].complete.total_course_count + '</td>';
        element += '<td class="center">' + list[index].quiz_correction.correct_count + ' / ' + list[index].quiz_correction.total_count + '</td>';
        element += '<td class="center">' + list[index].final_correction.correct_count + ' / ' + list[index].final_correction.total_count + '</td>';
        element += '<td class="center">' + (list[index].reeltime.video_watch_count === undefined ? '0' : list[index].reeltime.video_watch_count) + ' / ' +
          (list[index].reeltime.video_count === undefined ? '0' : list[index].reeltime.video_count) + '</td>';
        // element += '<td class="center">' + list[index].reeltime.played_seconds + ' / ' + list[index].reeltime.duration + '</td>';
        element += '<td class="center">' + days + ' / ' + list[index].speed.edu_period + '</td>';
        // element += '<td class="center">' + list[index].speed.user_period + ' / ' + list[index].speed.edu_period + '</td>';
        element += '<td class="center">' + (list[index].repetition.value === 1 ? '예' : '아니오') + '</td>';

        var pointSum =
          list[index].complete.value * list[index].point_complete +
          list[index].quiz_correction.value * list[index].point_quiz +
          list[index].final_correction.value * list[index].point_final +
          (list[index].reeltime.value * (list[index].point_reeltime - (list[index].reeltime.refresh_count === undefined ? 0 : list[index].reeltime.refresh_count))) +
          // list[index].reeltime.value * list[index].point_reeltime +
          list[index].speed.value * list[index].point_speed +
          list[index].repetition.value * list[index].point_repetition;

        element += '<td class="center">' + pointSum.toFixed(2) + '</td>';
        element += '</tr>';
        $('#table_point_details > tbody ').append(element);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  });
}); // end of func
