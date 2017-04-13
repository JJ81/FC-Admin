
'use strict';

window.requirejs([ 'common' ],
(Util) => {
  $(() => {
    Util.initDataTable($('#table-personal-point-rank'), {
      'order': [[ 0, 'asc' ]]
    });
  });
});
