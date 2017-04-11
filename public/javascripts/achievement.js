/**
 * Created by yijaejun on 30/11/2016.
 */

'use strict';
requirejs([
  'common'
],
(Util) => {
  // datatable 설정
  Util.initDataTable($('#table_achievement'));
});
