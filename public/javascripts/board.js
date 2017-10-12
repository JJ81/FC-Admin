window.requirejs([
  'common'
],
function (Util, AquaPlayerService) {
  var $ = $ || window.$;
  var $fileUpload = $('#file');

  $(function () {
    // datatable 설정
    Util.initDataTable($('#table-board'));
  });

  $fileUpload.change(function () {
    var fileSize = $(this).get(0).files[0].size;
    console.log(fileSize);
    if (fileSize >= 2 * 1024 * 1024) {
      window.alert('2MB 이하의 파일만 업로드 가능합니다.');
      $(this).val('');
    }
  });
});
