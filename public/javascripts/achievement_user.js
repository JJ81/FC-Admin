'use strict';
requirejs([
  'common'
],
(Util) => {
  // datatable 설정
  Util.initDataTable($('#table_achievement_user'), {
    'order': [[ 0, 'asc' ]]
  });
});
