'use strict';

window.define([
  'common'
  // 'jquery-form'
], function (Util) {
  var self;
  var $ = $ || window.$;
  var axios = axios || window.axios;
  var XHR = new window.XMLHttpRequest();
  var uploadedFileName;

  var bar = $('.fileuploader-bar');
  var percent = $('.fileuploader-percent');
  var status = $('#status');
  var percentVal = '0%';

  function JqueryFormUploaderService (options) {
    self = this;

    self.extendOptions(options);
    self.init();
  }

  JqueryFormUploaderService.prototype = {
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
      $('#cancel-button').attr('disabled', true);
      $('#upload-button').on('click', function () {
        if (!self.validate()) return false;

        $('#upload-button').attr('disabled', true);
        $('#cancel-button').attr('disabled', false);

        self.getUploadInfo();
      });
      $('#cancel-button').on('click', function (e) {
        XHR.abort();
        self.cancelUpload();
      });
    },
    // 업로드 정보를 요청한다.
    getUploadInfo: function () {
      axios.get('/api/v1/fineuploader/token')
      .then(function (response) {
        var data = response.data.uploadInfo;
        if (data) {
          console.log(data);

          self.options.uploadUrl = data.uploadUrl.replace('v4', 'cdnovp');
          self.options.uploadCancelUrl = data.uploadCancelUrl;
          self.options.token = data.token;

          // 업로드 한다.
          self.send();
        }
      });
    },
    clearForm: function () {
      $('#upload-button').attr('disabled', false);
      $('#cancel-button').attr('disabled', true);
      $('#fileupload').val('');

      percentVal = '0%';
      bar.width(percentVal);
      percent.html(percentVal);
    },
    // 업로드를 취소한다.
    cancelUpload: function () {
      axios.post(self.options.uploadCancelUrl + '?token=' + self.options.token, {
        token: self.options.token
      })
      .then(function (response) {
        window.alert('업로드 취소');

        self.clearForm();
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    validate: function () {
      if ($('#fileupload').get(0).files.length === 0) {
        window.alert('파일을 선택하세요.');
        return false;
      }

      return true;
    },
    // 파일 업로드
    // ref: https://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously
    send: function () {
      var formData = new window.FormData();
      var fileToUpload = $('#fileupload').get(0).files[0];
      uploadedFileName = Util.makeid() + '.mp4';
      // uploadedFileName = Util.makeid() + '.' + Util.getExtension(fileToUpload.name);

      formData.append('token', self.options.token);
      formData.append('folder', 2004661);
      formData.append('pkg', 1006241);
      formData.append('target_path', self.options.uploadFolder);
      formData.append('videofile', fileToUpload, uploadedFileName);

      $.ajax({
        url: self.options.uploadUrl + '?token=' + self.options.token,
        data: formData,
        type: 'post',
        contentType: false,
        processData: false,
        cache: false,
        beforeSend: function () {
          status.empty();
          percentVal = '0%';
          bar.width(percentVal);
          percent.html(percentVal);
        },
        xhr: function () {
          if (XHR.upload) {
            XHR.upload.addEventListener('progress', function (e) {
              if (e.lengthComputable) {
                percentVal = Math.floor(e.loaded / e.total * 100) + '%';
                bar.width(percentVal);
                percent.html(percentVal);
              }
            }, false);
          }
          return XHR;
        },
        success: function (responseText) {
          var data = JSON.parse(responseText);

          console.log(data);

          if (data.uploadInfo.errorInfo.errorCode === 'None') {
            percentVal = '100%';
            bar.width(percentVal);
            percent.html(percentVal);

            window.alert('업로드 성공');

            self.clearForm();

            $('#aqua-video-code').val('onm_' + uploadedFileName);
            $('#fineUploader').modal('hide');

            self.options.callback({
              success: true,
              videoName: uploadedFileName,
              pkg: 1006241,
              access_key: data.uploadInfo.uploadDetail.access_key,
              token: self.options.token
            });
          } else {
            window.alert(data.uploadInfo.errorInfo.errorMessage);
          }

          $('#upload-button').attr('disabled', false);
          $('#cancel-button').attr('disabled', true);
        }
      });
    },
    send2: function () {
      // var bar = $('.bar');
      // var percent = $('.percent');
      // var status = $('#status');
      // var options = {
      //   url: self.options.uploadUrl + '?token=' + self.options.token,
      //   type: 'post',
      //   dataType: 'json',
      //   clearForm: true,
      //   resetForm: true,
      //   target: '#fileupload-form',
      //   data: {
      //     token: self.options.token,
      //     folder: 2004661,
      //     pkg: 1006241,
      //     target_path: self.options.uploadFolder
      //   },
      //   // timeout: 3000,
      //   beforeSerialize: function ($form, options) {
      //     console.log($form);
      //     console.log(options);
      //     return true;
      //   },
      //   beforeSumbit: function (formData, jqForm, options) {
      //     console.log(formData);
      //     formData.set('videofile', $('#fileupload').get(0).files[0], '123.mp4');
      //     return true;
      //   },
      //   beforeSend: function () {
      //     status.empty();
      //     var percentVal = '0%';
      //     bar.width(percentVal);
      //     percent.html(percentVal);
      //   },
      //   uploadProgress: function (event, position, total, percentComplete) {
      //     var percentVal = percentComplete + '%';
      //     bar.width(percentVal);
      //     percent.html(percentVal);
      //   },
      //   success: function (responseText, statusText, xhr, $form) {
      //     console.log(responseText);
      //     var percentVal = '100%';
      //     bar.width(percentVal);
      //     percent.html(percentVal);
      //   },
      //   complete: function (xhr) {
      //     status.html(xhr.responseText);
      //   }
      // };

      // $('#fileupload-form').ajaxForm(options);
    }
  };

  return JqueryFormUploaderService;
});
