'use strict';

window.define([
  'common',
  'jquery.iframe-transport',
  'jquery-ui/ui/widget',
  'jquery.fileupload'
], function (Util) {
  var self;
  var $ = $ || window.$;
  var axios = axios || window.axios;
  var jqXHR;

  function JqueryFileUploaderService (options) {
    self = this;

    self.extendOptions(options);
    self.init();
  }

  JqueryFileUploaderService.prototype = {
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
      $('#cancel-button').attr('disabled', true);
    },
    getUploadInfo: function () {
      axios.get('/api/v1/fineuploader/token')
      .then(function (response) {
        var data = response.data.uploadInfo;
        if (data) {
          self.options.uploadUrl = data.uploadUrl.replace('v4', 'cdnovp');
          self.options.uploadCancelUrl = data.uploadCancelUrl;
          self.options.token = data.token;

          console.log(data);

          self.setJqueryFileUploader();
        }
      });
    },
    // 업로드를 취소한다.
    cancelUpload: function () {
      axios.post(self.options.uploadCancelUrl + '?token=' + self.options.token, {
        token: self.options.token
      })
      .then(function (response) {
        window.alert('업로드 취소');
        window.location.reload();
        // $('#upload-button').attr('disabled', false);
        // $('#cancel-button').attr('disabled', true);

        // $('#fileupload').fileupload('destroy');
        // $('#fileupload').val('');

        // self.getUploadInfo();
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    setJqueryFileUploader: function () {
      console.log(self.options);
      $('#fileupload').attr('data-url', self.options.uploadUrl + '?token=' + self.options.token);

      $('#fileupload').fileupload({
        dataType: 'json',
        singleFileUploads: true,
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(mp4|avi)$/i,
        formData: {
          token: self.options.token,
          folder: 2004661,
          pkg: 1006241,
          target_path: self.options.uploadFolder
        },
        replaceFileInput: false,
        add: function (e, data) {
          $('#upload-button').off('click').on('click', function () {
            $('#upload-button').attr('disabled', true);
            $('#cancel-button').attr('disabled', false);

            jqXHR = data.submit();
          });
        },
        done: function (e, data) {
          var responseJSON = data.jqXHR.responseJSON;

          if (responseJSON.uploadInfo.errorInfo.errorCode === 'None') {
            window.alert('업로드 성공');
            $('#fineUploader').modal('hide');
            self.options.callback(data);
          } else {
            window.alert(responseJSON.uploadInfo.errorInfo.errorMessage);
          }

          $('#upload-button').attr('disabled', false);
          $('#cancel-button').attr('disabled', true);
        },
        progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress-value').html(progress + '%');
          $('#progress .jquery-file-progress-bar').css(
              'width',
              progress + '%'
          );
        }
      });

      $('#fileupload').bind('fileuploadadd', function (e, data) {
        $.each(data.files, function (index, file) {
          $('#aqua-video-code').val('onm_' + file.name);
        });

        $('#cancel-button').on('click', function (e) {
          jqXHR.abort();
        });
      });

      $('#fileupload').bind('fileuploadfail', function (e, data) {
        if (data.errorThrown === 'abort') {
          self.cancelUpload();
        }
      });
    }
  };

  return JqueryFileUploaderService;
});
