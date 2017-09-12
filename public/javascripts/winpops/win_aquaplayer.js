'use strict';
window.requirejs(
  [
    'common',
    'aquaPlayerService'
  ],
  function (Util, AquaPlayerService) {
    var $ = $ || window.$;

    $(function () {
      var options = {
        fileUrl: 'http://pcst.aquan.dev.edu1004.kr/orangenamu/dev/cdnetworks.mp4',
        html5: false,
        userId: 'test',
        callback: function () {
          console.log('aqua service intialized');
        }
      };

      AquaPlayerService = new AquaPlayerService(options);
    });

    $(window).resize(function () {
      if (window.player && !window.player.getFullscreen()) {
        console.log('resized-1');
        $('#video').height($(window).height());
      } else {
        console.log('resized-2');
        $('#video').height($(window).height() - $('.wrapper_foot').height());
      }
    });
  }
);
