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
        container: $('.aquaplayer'),
        callback: function () {
          console.log('aqua service intialized');
        }
      };

      AquaPlayerService = new AquaPlayerService(options);
    });
  }
);
