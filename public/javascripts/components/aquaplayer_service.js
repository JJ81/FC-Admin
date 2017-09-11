'use strict';
window.define([
  'common',
  'text!../../../nplayer_wrapper.html',
  'nplayer',
  'nplayer_ui',
  'cdnproxy',
  'nplayer_conf'
], function (Util, NplayerWrapperTemplate) {
  var self = null;
  var encodedParam;
  var player;
  var $ = $ || window.$;

  function AquaPlayerService (options) {
    self = this;

    self.extendOptions(options);
    self.init();
  }

  AquaPlayerService.prototype = {
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
      self.getEncodedParam();
      self.resize();
      // self.options.container.html(NplayerWrapperTemplate);
      // window.$('#video').height(window.$(window).height() - window.$('.wrapper_foot').height());
    },
    initPlayer: function () {
      window.player = new window.NPlayer('video', {
        controlBox: 'nplayer_control.html',
        visible: false,
        mode: 'html5'
      });

      window.initNPlayerUI(player);

      player.bindEvent('Ready', function () {
        self.reportMessage('ready');

        window.proxy_init(function () {
          // 1. video start set
          window.setPlayerStart(true);
          // 2. nplayer instance set
          window.setNPlayer(player);
          // 4. media info set
          window.mygentAuthCall(function (genkey) {
            window.setMediaInfo(self.options.fileUrl, genkey);

            var url = window.getMediaURL(false);
            player.open({
              'URL': window.encodeURI(url)
            });
          }, encodedParam);
        }, window.indicateInstall, window.indicateUpdate);
      });

      player.bindEvent('OpenStateChanged', function (state) {
        self.reportMessage('OpenStateChanged');

        switch (state) {
        case window.NPlayer.OpenState.Opened:
          player.setVisible(true);
          window.starthtml5State();
          break;
        case window.NPlayer.OpenState.Closed:
          window.Stophtml5State(window.NPlayer.OpenState.Closed);
          break;
        }
      });

      player.bindEvent('PlayStateChanged', function (state) {
        self.reportMessage('PlayStateChanged');

        switch (state) {
        case window.NPlayer.PlayState.Playing:
          player.setVisible(true);
          break;

        case window.NPlayer.PlayState.Stopped:
          player.setVisible(false);
          break;

        case window.NPlayer.PlayState.Paused:
          player.setVisible(true);
          break;
        }
      });

      player.bindEvent('GuardCallback', function (name, desc) {
        self.reportMessage('GuardCallback - ' + name + ' : ' + desc);
      });

      player.bindEvent('Error', function (ec) {
        self.reportMessage('Error - ' + ec);
      });
    },
    // encparam 을 서버에서 생성하여 전달받는다.
    getEncodedParam: function () {
      window.axios.get('/api/v1/player/encparam')
        .then(function (res) {
          encodedParam = res.data.encparam;
          self.reportMessage(encodedParam);
          self.initPlayer();
        })
        .catch(function (err) {
          self.reportError(err);
        }
      );
    },
    reportMessage: function (msg) {
      console.log('aquaservice : ' + msg);
    },
    reportError: function (err) {
      console.log('aquaservice : ' + err);
    },
    resize: function () {
      $(window).resize(function () {
        if (player && !!player.getFullscreen()) {
          $('#video').height($(window).height());
        } else {
          $('#video').height($(window).height() - $('.wrapper_foot').height());
        }
      });
    }
  };

  return AquaPlayerService;
});
