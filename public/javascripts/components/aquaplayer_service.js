'use strict';
window.define([
  'common',
  'nplayer',
  'nplayer_ui',
  'cdnproxy',
  'nplayer_conf'
], function (Util) {
  var self = null;
  var encodedParam;

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
      self.options.callback();
    },
    getEncodedParam: function () {
      window.axios.get('/api/v1/player/encparam')
        .then(function (res) {
          this.encodedParam = res.data.encparam;
        })
        .catch(function (err) {
          self.reportError(err);
        }
      );
    },
    reportError: function (err) {
      window.alert('aquaservice : ' + err);
    }
  };

  return AquaPlayerService;
});
