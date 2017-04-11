
'use strict';

requirejs([ 'common' ],
(Util) => {
  $(() => {
    Util.initDataTable($('#table-personal-point-rank'), {
      'order': [[ 0, 'asc' ]]
    });
  });
});
