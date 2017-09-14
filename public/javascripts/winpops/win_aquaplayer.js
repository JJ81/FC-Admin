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
        fileUrl: $('#video').data('url'),
        callback: function () {
          // console.log('aqua service intialized');
        }
      };

      AquaPlayerService = new AquaPlayerService(options);
    });
  }
);
