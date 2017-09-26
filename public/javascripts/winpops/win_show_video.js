'use strict';

window.requirejs([
  'common',
  'jqueryUploaderService'
], function (Util, JqueryFileUploaderService) {
  var $ = $ || window.$;
  var $aquaPlayerFrame = $('#aquaplayer_frame');
  var videoProvider = $('#video-provider').val();
  var videoId = $('#video-id').val();

  window.$(function () {
    if (videoProvider === 'AQUA') {
      $aquaPlayerFrame.attr('src', '/api/v1/aqua?os=' + Util.getOSName() + '&video_id=' + videoId);
    }
  });
});
