'use strict';
requirejs([
  'common'
],
(Util) => {
  // datatable 설정
  Util.initDataTable($('#table_achievement_user_details'), {
    'order': [[ 0, 'asc' ]]
  });

  /**
   * 상세내역 모달창
   *
   */
  $('#modal-achievement-user-details').on('show.bs.modal', (e) => {
    axios.get('/achievement/user/education', {
      params: {
        training_user_id: $(e.relatedTarget).data('training-user-id')
      }
    })
    .then((response) => {
      $('#table_education_details > tbody ').html('');
      const list = response.data.list;
      let element = '';
      for (let index = 0; index < list.length; index++) {
        element = '<tr>';
        element += '  <td>' + list[index].course_name + '</td>';
        element += '  <td>';
        element += '    <div class="progress progress-xs">';
        element += '      <div class="progress-bar ' + response.data.progress_bar_theme + ' progress-bar-striped" style="width: ' + list[index].completed_rate + '%"></div>';
        element += '    </div>';
        element += '  </td>';
        element += '  <td class="center">';
        if (list[index].completed_rate === 100) {
          element += '    <span class="badge bg-green">';
        } else {
          element += '    <span class="badge bg-red">';
        }
        element += '      ' + list[index].completed_rate + '%';
        element += '    </span>';
        element += '  </td>';
        if (list[index].course_start_dt && list[index].course_end_dt) {
          element += '  <td class="center">' + list[index].course_start_dt + ' ~ ' + list[index].course_end_dt + '</td>';
        } else {
          element += '  <td class="center"></td>';
        }
        element += '</tr>';
        $('#table_education_details > tbody ').append(element);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  });
});
