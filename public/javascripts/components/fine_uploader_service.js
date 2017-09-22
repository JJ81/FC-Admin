'use strict';

window.define([
  'jquery',
  'axios',
  'fineUploader', // fineUploaderCore
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

          // self.setFineUploaderBasic();
          self.setFineUploader();
        }
      });
    },
    setFineUploader: function () {
      $('#uploader-template').append(qqTemplate);
      uploader = new qq.FineUploader({
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
            // console.log(responseJSON);
          }
        }
      });
      qq(document.getElementById('upload-button')).attach('click', function () {
        uploader.uploadStoredFiles();
      });
    },
    setFineUploaderBasic: function () {
      var $fub = $('#fine-uploader-basic');
      var $messages = $('#messages');

      uploader = new qq.FineUploaderBasic({
        button: $fub[0],
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
          onSubmit: function (id, fileName) {
            $messages.append('<div id="file-' + id + '" class="alert" style="margin: 20px 0 0"></div>');
          },
          onUpload: function (id, fileName) {
            $('#file-' + id).addClass('alert-info')
              .html('<img src="/static/stylesheets/images/loading.gif" alt="Initializing. Please hold."> ' +
                    'Initializing ' +
                    '“' + fileName + '”');
          },
          onProgress: function (id, fileName, loaded, total) {
            if (loaded < total) {
              var progress = Math.round(loaded / total * 100) + '% of ' + Math.round(total / 1024) + ' kB';
              $('#file-' + id).removeClass('alert-info')
                .html('<img src="/static/stylesheets/images/loading.gif" alt="In progress. Please hold."> ' +
                  'Uploading ' +
                  '“' + fileName + '” ' +
                  progress);
            } else {
              $('#file-' + id).addClass('alert-info')
                .html('<img src="/static/stylesheets/images/loading.gif" alt="Saving. Please hold."> ' +
                      'Saving ' +
                      '“' + fileName + '”');
            }
          },
          onComplete: function (id, fileName, responseJSON) {
            if (responseJSON.success) {
              $('#file-' + id).removeClass('alert-info')
                .addClass('alert-success')
                .html('<i class="icon-ok"></i> ' +
                      'Successfully saved ' +
                      '“' + fileName + '”' +
                      '<br><img src="img/success.jpg" alt="' + fileName + '">');
            } else {
              $('#file-' + id).removeClass('alert-info')
                .addClass('alert-error')
                .html('<i class="icon-exclamation-sign"></i> ' +
                      'Error with ' +
                      '“' + fileName + '”: ' +
                      responseJSON.error);
            }
          }
        },
        debug: true
      });

      qq(document.getElementById('upload-button')).attach('click', function () {
        uploader.uploadStoredFiles();
      });
    }
  };

  return FineUploaderService;
});
