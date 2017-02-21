
'use strict';

requirejs(['common' ],
function (Util) {
  $(function () {
    Util.initDataTable($('#table-personal-point-rank'), {
      'order': [[ 0, 'asc' ]]
    });
  });
});
