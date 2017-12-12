'use strict';
window.requirejs([ 'common' ],
function (Util) {
  var $ = $ || window.$;
  var $video = $('#frame-video');
  var $btnAdmin = $('#btn-admin');
  var $btnUser = $('#btn-user');

  $(function () {
    displayAdminVideo();
  });

  $btnAdmin.on('click', function () {
    displayAdminVideo();
  });

  $btnUser.on('click', function () {
    displayUserVideo();
  });

  function displayAdminVideo () {
    $video.attr('src', '/api/v1/aqua-direct?os=' + Util.getOSName() + '&url=onm_오렌지러닝_관리자.mp4');
  }

  function displayUserVideo () {
    $video.attr('src', '/api/v1/aqua-direct?os=' + Util.getOSName() + '&url=onm_오렌지러닝_교육생.mp4');
  }
});
