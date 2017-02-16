/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict'
require([ 'jquery', 'common' ],
function ($, Util) {
  $(function () {
    Util.initDataTable($('#table-personal-point-rank'), {
      'order': [[ 0, 'asc' ]]
    })
  })
})
