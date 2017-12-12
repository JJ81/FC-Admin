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
    $video.attr('src', '/api/v1/aqua-direct?os=' + Util.getOSName() + '&url=onm_orange_admin.mp4');
  }

  function displayUserVideo () {
    $video.attr('src', '/api/v1/aqua-direct?os=' + Util.getOSName() + '&url=onm_orange_user.mp4');
  }
});
