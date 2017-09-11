
'use strict';
window.define([], function () {
  // var timerid = 0;
  // var isDup = false;

  function getE (L) {
    return document.getElementById(L);
  }

  return {

    chkObj: function () {
      console.log('timerid', this.timerid);
      var L = getE('AquaAxPlugin');

      console.log('AquaAxPlugin', L.object);
      console.log(L.checkAquaAxVersion(window.AX_VERSION), window.AX_VERSION);
      console.log('cleared interval : ' + this.timerid);

      if (L.object) {
        if (L.checkAquaAxVersion(window.AX_VERSION) === true) {
          clearInterval(this.timerid);
          window.location.reload();
        }
      }
    },

    loadAquaAxPlugin: function () {
      window.$('html').append('<OBJECT CLASSID="clsid:81C08477-A103-4FDC-B7A6-953940EAD67F"  codebase="' + window.NPLAYER_SETUP_URL + '#version=' + window.AX_VERSION + '" width="0" height="0" ID="AquaAxPlugin" ></OBJECT>');

      if (typeof window.AquaAxPlugin.InitAuth !== 'undefined') {
        console.log('plugin loaded');
        return true;
      } else {
        var _this = this;
        _this.timerid = setInterval(function () {
          var L = _this.getE('AquaAxPlugin');

          if (L.object) {
            if (L.checkAquaAxVersion(window.AX_VERSION) === true) {
              clearInterval(_this.timerid);
              window.location.reload();
            }
          }
        }, 1000);
      }
    },

    setAquaAxPlugin: function (url, param) {
      if (typeof window.AquaAxPlugin.InitAuth !== 'undefined') {
        window.AquaAxPlugin.authParam = param;
        window.AquaAxPlugin.InitAuth();
        window.AquaAxPlugin.mediaURL = url;
        window.AquaAxPlugin.OpenMedia();
        return true;
      } else {
        return false;
      }
    },

    setMegaSubtitle: function (fontName, fontSize, r, g, b, a, x, y, text) {
      window.player.setSubtitleFont(fontName, fontSize);
      window.player.setSubtitleColor(r, g, b, a);
      window.player.setSubtitlePosition(x, y);
      window.player.setSubtitleText(text);
    },

    dupPlayerStop: function () {
      var msg = window.NPLAYER_DUP_MSG;
      window.player.stop();
      setTimeout(function () {
        window.alert(msg);
      }, 200);
      isDup = true;
    },

    getPlayerDuration: function () {
      var duration = window.player.getDuration();
      return (parseInt(duration * 1000));
    },

    getPlaybackRate: function () {
      var playbackrate = window.player.getCurrentPlaybackRate();
      return (parseInt(playbackrate * 1000));
    },

    getCurrentPosition: function () {
      var pos = window.player.getCurrentPlaybackTime();
      return (parseInt(pos * 1000));
    }
  };
});

