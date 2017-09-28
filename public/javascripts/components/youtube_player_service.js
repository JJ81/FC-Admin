'use strict';
window.define([
  'common'
], function (Util) {
  var self = null;
  var $ = $ || window.$;

  function YoutubePlayerService (options) {
    self = this;

    self.extendOptions(options);
    self.init();
  }

  YoutubePlayerService.prototype = {
    // 옵션 저장 변수
    options: {},
    extend: function (a, b) {
      for (var key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    },
    // 옵션 확장
    extendOptions: function (options) {
      this.options = this.extend({}, this.options);
      this.extend(this.options, options);
    },
    // 컴포넌트 초기화
    init: function () {
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      window.onYouTubeIframeAPIReady = function () {
        window.player = new window.YT.Player('player', {
          height: '600',
          width: '100%',
          videoId: self.options.videoId,
          events: {
            'onReady': window.onPlayerReady,
            'onStateChange': window.onPlayerStateChange
          }
        });
      };

      // 4. The API will call this function when the video player is ready.
      window.onPlayerReady = function (event) {
        event.target.playVideo();
      };

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      window.done = false;
      window.onPlayerStateChange = function (event) {
        // if (event.data == window.YT.PlayerState.PLAYING && !window.done) {
        //   setTimeout(window.stopVideo, 6000);
        //   window.done = true;
        // }
      };

      window.stopVideo = function () {
        window.player.stopVideo();
      };
    },
    reportMessage: function (msg) {
      console.log('aquaservice : ' + msg);
    },
    reportError: function (err) {
      console.log('aquaservice : ' + err);
    },
    resize: function () {
      $(window).resize(function () {
        $('#video').height($(window).height() - $('.wrapper_foot').height());
      });
    }
  };

  return YoutubePlayerService;
});
