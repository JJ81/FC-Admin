'use strict';
window.requirejs([ 'common' ],
function (Util) {
  var $ = $ || window.$;
  var $adminVideo = $('#admin_video');
  var $userVideo = $('#user_video');

  $(function () {
    displayVideo();
  });

  function displayVideo () {
    $adminVideo.attr('src', '/api/v1/aqua-direct?os=' + Util.getOSName() + '&url=onm_오렌지러닝_관리자.mp4');
    $userVideo.attr('src', '/api/v1/aqua-direct?os=' + Util.getOSName() + '&url=onm_오렌지러닝_.mp4');
  }
});
