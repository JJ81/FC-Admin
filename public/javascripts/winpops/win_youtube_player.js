'use strict';
window.requirejs(
  [
    'common',
    'youtubePlayerService'
  ],
  function (Util, YoutubePlayerService) {
    var $ = $ || window.$;

    $(function () {
      var options = {
        videoId: $('#video-code').val(),
        callback: function () {

        }
      };

      YoutubePlayerService = new YoutubePlayerService(options);
    });
  }
);
