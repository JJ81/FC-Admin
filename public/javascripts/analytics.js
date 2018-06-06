window.requirejs([
  'common'
],
function (Util) {
  var $ = $ || window.$;

  // datatable 설정
  Util.initDataTable($('#table_analytics'));
});
