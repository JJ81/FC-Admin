'use strict';
window.requirejs(
  [
    'common',
    'nplayer',
    'nplayer_ui',
    'cdnproxy',
    'nplayer_conf'
  ],
  function (Util) {
    var $ = $ || window.$;
    var player;
    var fileURL = 'http://pcst.aquan.dev.edu1004.kr/orangenamu/dev/cdnetworks.mp4';

    $(function () {
      $(window).resize();

      window.axios.get('/api/v1/player/encparam')
      .then(function (response) {
        var encparam = response.data.encparam;

        // console.log('encparam =', encparam);

        player = new window.NPlayer('video', {
          controlBox: 'nplayer_control.html',
          visible: false,
          mode: 'html5'
        });

        console.log(player);

        window.initNPlayerUI(player);

        player.bindEvent('Ready', function () {
          console.log('Ready');
          window.proxy_init(function () {
            // 1. video start set
            window.setPlayerStart(true);
            // 2. nplayer instance set
            window.setNPlayer(player);
            // 4. media info set
            window.mygentAuthCall(function (genkey) {
              window.setMediaInfo(fileURL, genkey);

              var url = window.getMediaURL(false);
              player.open({
                'URL': encodeURI(url)
              });
            }, encparam);
          }, window.indicateInstall, window.indicateUpdate);
        });

        player.bindEvent('OpenStateChanged', function (state) {
          console.log('OpenStateChanged');
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
          console.log('PlayStateChanged');
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
          console.log('GuardCallback');
          console.log(name + ' : ' + desc);
        });

        player.bindEvent('Error', function (ec) {
          console.log('Error', ec);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
    });

    $(window).resize(function () {
      if (player && !!player.getFullscreen()) {
        $('#video').height($(window).height());
      } else {
        $('#video').height($(window).height() - $('.wrapper_foot').height());
      }
    });
  }
);
