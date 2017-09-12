'use strict';
window.define([
  'common',
  'text!../../../nplayer_wrapper.html',
  'axplugin',
  'nplayer',
  'nplayer_ui',
  'cdnproxy',
  'nplayer_conf'
], function (Util, NplayerWrapperTemplate, ax) {
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
    },
    initPlayer: function () {
      if ('ActiveXObject' in window) {
        self.initPlayerWindow();
      } else {
        self.initPlayerHTML();
      }
    },
    // Player 초기화
    initPlayerHTML: function () {
      player = new window.NPlayer('video', {
        controlBox: 'nplayer_control.html',
        visible: false,
        mode: 'html5'
      });

      // player.setWatermarkText('watermark');

      window.player = player;

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
    initPlayerWindow: function () {
      player = new window.NPlayer('video', {
        controlBox: 'nplayer_control.html',
        visible: false,
        mode: 'html5'
      });
      // var setAxPlugin = false;

      // player.setWatermarkText('watermark');

      window.player = player;

      window.initNPlayerUI(player);

      player.bindEvent('Ready', function () {
        self.reportMessage('Ready');

        player.setCDNAuthParam(encodedParam);
        player.addContextMenu('SystemInfo', 'sysinfo');

        console.log('fileURL : ' + self.options.fileURL);
        player.open({
          'URL': encodeURI(self.options.fileURL)
        });
      });

      player.bindEvent('OpenStateChanged', function (state) {
        self.reportMessage('OpenStateChanged');

        switch (state) {
        case window.NPlayer.OpenState.Opened:
          player.setVisible(true);
          break;
        case window.NPlayer.OpenState.Closed:
          break;
        }
      });

      player.bindEvent('PlayStateChanged', function (state) {
        self.reportMessage('PlayStateChanged');

        switch (state) {
        case window.NPlayer.PlayState.Playing:
          player.setVisible(true);

          if (ax.isDup === true) {
            player.stop();
            window.alert(window.NPLAYER_DUP_MSG);
            break;
          }

          if (setAxPlugin === true) {
            window.AquaAxPlugin.PlayState = window.NPlayer.PlayState.Playing;
            window.AquaAxPlugin.OpenStateChange();
          }
          break;

        case window.NPlayer.PlayState.Stopped:
          player.setVisible(false);
          break;

        case window.NPlayer.PlayState.Paused:
          player.setVisible(true);

          if (setAxPlugin === true) {
            window.AquaAxPlugin.PlayState = window.NPlayer.PlayState.Paused;
            window.AquaAxPlugin.OpenStateChange();
          }
          break;
        }
      });

      player.bindEvent('GuardCallback', function (name, desc) {
        if (setAxPlugin === true) window.AquaAxPlugin.SendPVLog(name, desc);
      });

      player.bindEvent('Error', function (ec) {
        $('#video').css('background-image', 'none');
      });

      player.bindEvent('ContextMenu', function (val) {
        if (val === 'sysinfo') {
          if (setAxPlugin === true) {
            window.AquaAxPlugin.LoadSystemInfomation();
            window.alert(
              'CPU 정보 : ' + window.AquaAxPlugin.DeviceCPU + '\n' +
              'MEM 정보 : ' + window.AquaAxPlugin.DeviceMem + '\n' +
              'GPU 정보 : ' + window.AquaAxPlugin.DeviceGPU + '\n\n' +
              'IP 정보 : ' + window.AquaAxPlugin.DeviceIP + '\n' +
              'Mac 정보 : ' + window.AquaAxPlugin.DeviceMac + '\n' +
              'OS 정보 : ' + window.AquaAxPlugin.DeviceOSDesc + '\n' +
              '해상도 정보 : ' + window.AquaAxPlugin.DeviceMonitor + '\n' +
              'IE 버전 : ' + window.AquaAxPlugin.DeviceIE + '\n'
            );
          }
        }
      });

      window.onunload = function () {
        if (setAxPlugin === true) window.AquaAxPlugin.FinalizeAuth();
      };
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
