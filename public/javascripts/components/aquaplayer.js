'use strict';
window.define([
  'common',
  'nplayer',
  'nplayer_ui',
  'cdnproxy',
  'nplayer_conf'
], function (Util) {
  function AquaPlayer (options) {
    this.extendOptions(options);
    this.init();
  }

  AquaPlayer.prototype = {
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
      console.log(this.options);
    }
  };

  return AquaPlayer;
});
