'use strict';

window.define([
  'jquery',
  'axios',
  'fineUploaderCore', // fineUploader
  'text!../../fine_uploader.html'
], function ($, axios, qq, qqTemplate) {
  var self;
  var uploader;

  function FineUploaderService (options) {
    self = this;

    self.extendOptions(options);
    self.init();
  }

  FineUploaderService.prototype = {
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
      self.getUploadInfo();
    },
    getUploadInfo: function () {
      axios.get('/api/v1/fineuploader/token')
      .then(function (response) {
        var data = response.data.uploadInfo;
        if (data) {
          self.options.uploadUrl = data.uploadUrl.replace('v4', 'cdnovp');
          self.options.uploadCancelUrl = data.uploadCancelUrl;
          self.options.token = data.token;

          // console.log(self.options);
          self.setFineUploader();
        }
      });
    },
    setFineUploader: function () {
      // $('#uploader-template').append(qqTemplate);
      uploader = new qq.FineUploaderBasic({
      // uploader = new qq.FineUploader({
        element: document.getElementById(self.options.el),
        autoUpload: false,
        multiple: self.options.mutiple,
        cors: {
          allowXdr: true,
          expected: true
        },
        validation: {
          allowedExtensions: ['avi', 'mp4'],
          itemLimit: 3,
          stopOnFirstInvalidFile: true
        },
        request: {
          endpoint: self.options.uploadUrl,
          inputName: 'videofile',
          paramsInBody: false,
          params: {
            token: self.options.token,
            folder: '/dev',
            target_path: '/dev'
          }
        },
        callbacks: {
          onComplete: function (id, name, responseJSON, xhr) {
            console.log(responseJSON);
          }
        }
      });
      qq(document.getElementById('upload-button')).attach('click', function () {
        uploader.uploadStoredFiles();
      });
    }
  };

  return FineUploaderService;
});
