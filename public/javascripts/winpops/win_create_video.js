'use strict';

window.requirejs([
  'common',
  'Vimeo',
  // 'jqueryUploaderService',
  'jqueryFormUploaderService'
],
function (Util, Vimeo, JqueryFormUploaderService) {
  var $ = $ || window.$;
  // var player = null;
  // var playerContainer = $('#videoplayer');
  var $btnRegistVideo = $('#regist-video');
  var $btnUploadVideo = $('#uploadVideo');
  var $btnPlayVideo = $('#play-video');
  // var _confirm = true; // 윈도우 종료 시 창을 닫을지 여부
  var $selectVideoProvider = $('#video-provider');
  var $setAquaPlayer = $('.aquaplayer-settings');
  var $setVimeoPlayer = $('.vimeo-settings');
  var $aquaPlayerFrame = $('#aquaplayer_frame');
  // datatable 설정
  var tableVideos = Util.initDataTable($('#table_add_video'), { buttons: [] });
  var $btnChangeVideo = $('#btnApplyVideo');
  var $encodingProgress = $('.encoding-progress');
  var $fileUpload = $('#fileupload');

  window.$(function () {
    // $btnRegistVideo.button('loading');
    // setTimeout(function () {
    //   $btnRegistVideo.button('reset');
    // }, 3000);

    // console.log('hello!');
    // window.alert(window.parent.opener);
    // window.parent.opener.winpop_listener();

    // $aquaPlayerFrame.attr('src', '/api/v1/aqua?os=' + Util.getOSName() + '&video_id=148');

    // 영상 업로더 초기화
    var options = {
      uploadFolder: $('#upload_folder').val(),
      callback: function (data) {
        if (data.success) {
          // $encodingProgress.removeClass('blind');

          // var EncodingChecker;

          // // 인코딩 상태를 체크한다.
          // (function checkEncodingStatus () {
          //   window.axios.get('http://api.wecandeo.com/web/encoding/status.json?' +
          //     'key=' + data.token +
          //     '&access_key=' + data.access_key +
          //     '&pkg=' + data.pkg
          //   )
          //   .then(function (response) {
          //     var data = response.data;

          //     if (data.encodingStatus.errorInfo.erroCode === 'None') {
          //       EncodingChecker = setTimeout(checkEncodingStatus, 3000);
          //     } else {
          //       console.log(data);
          //       window.alert(data.encodingStatus.errorInfo.errorMessage);

          //       clearTimeout(EncodingChecker);
          //     }
          //   })
          //   .catch(function (error) {
          //     console.log(error);
          //   });
          // }());
          // $aquaPlayerFrame.attr('src', '/api/v1/aqua?os=' + Util.getOSName() + '&video_name=' + data.videoName);
        }
      }
    };

    JqueryFormUploaderService = new JqueryFormUploaderService(options);
  });

  // 보안 플레이어에서 파일 선택 시 파일명이 세션명으로 자동 등록된다.
  $fileUpload.change(function () {
    $('#video-title').val($('#fileupload').get(0).files[0].name);
  });

  $btnChangeVideo.bind('click', function (e) {
    e.preventDefault();

    var videoInfo = $('input:first:checked', tableVideos.rows({
      search: 'applied'
    }).nodes()).data();

    if (videoInfo !== undefined) {
      if (window.confirm('적용하시겠습니까?')) {
        // 모달창 종료
        $('#addVideo').modal('hide');
        $('#aqua-video-code').val(videoInfo.url);
        $aquaPlayerFrame.attr('src', '/api/v1/aqua?os=' + Util.getOSName() + '&video_id=' + videoInfo.id);
      }
    } else {
      window.alert('비디오를 선택하세요.');
    }
  });

  $selectVideoProvider.on('change', function () {
    var option = $(this).val();

    if (option === 'VIMEO' || option === 'YOUTUBE') {
      $setVimeoPlayer.removeClass('blind');
      $setAquaPlayer.addClass('blind');
      $('.video-preview').addClass('blind');
    } else if (option === 'AQUA') {
      $setAquaPlayer.removeClass('blind');
      $setVimeoPlayer.addClass('blind');
      $('.video-preview').removeClass('blind');
    }
  });

  $btnUploadVideo.on('click', function () {
    // var options = {
      // el: 'my-uploader',
      // multiple: false
    // };

    // FineUploaderService = new FineUploaderService(options);

    // var options = {
    //   uploadFolder: $('#upload_folder').val(),
    //   callback: function (data) {
    //   }
    // };

    // JqueryFormUploaderService = new JqueryFormUploaderService(options);
  });

  $('#vimeo-video-code').bind('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { displayVideo(); }
            // initPlayer();
  });

  $btnPlayVideo.bind('click', function (e) {
    displayVideo();
        // initPlayer();
  });

  $btnRegistVideo.bind('click', function (e) {
    e.preventDefault();

    if (!validateForm()) { return false; }
    if (!window.confirm('저장하시겠습니까?')) { return false; }

    var videoProvider = $('#video-provider').val();
    var videoCode;

    if (videoProvider === 'VIMEO' || videoProvider === 'YOUTUBE') {
      videoCode = $('input[name=\'vimeo_video_code\']').val();
    } else if (videoProvider === 'AQUA') {
      videoCode = $('input[name=\'aqua_video_code\']').val();
    }

    window.axios.post('/course/create/video', {
      course_id: $('input[name=\'course_id\']').val(),
      video_name: $('input[name=\'video_name\']').val(),
      video_provider: videoProvider,
      video_code: videoCode
    })
      .then(function (response) {
        window.alert('비디오를 저장하였습니다.');
        window.parent.opener.winpop_listener(true);
        window.close();
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });

    // var params = $('form').serialize();
    // $.ajax({
    //   url: $('form').attr('action'),
    //   type: 'POST',
    //   data: params,
    //   contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    //   dataType: 'html',
    //   success: function (response) {
    //     window.alert('비디오를 저장하였습니다.');
    //     // window.parent.opener.location.reload(); // 부모폼을 reload 한다.
    //     window.parent.opener.winpop_listener(true);

    //     // _confirm = false;
    //     window.close();
    //   }
    // });
  });

    /**
     * 폼 validate
     */
  function validateForm () {
    var videoTitle = $('#video-title');

    if (!videoTitle.val()) {
      window.alert('비디오 강좌명을 입력하세요.');
      videoTitle.focus();
      return false;
    }

    var videoProvider = $('#video-provider').val();
    var $videoCode;

    if (videoProvider === 'VIMEO' || videoProvider === 'YOUTUBE') {
      $videoCode = $('#vimeo-video-code');
    } else if (videoProvider === 'AQUA') {
      $videoCode = $('#aqua-video-code');
    }

    if (!$videoCode.val()) {
      window.alert('비디오 코드를 입력하세요.');
      $videoCode.focus();
      return false;
    }

    return true;
  }

    /**
     * 비디오를 표시한다.
     */
  function displayVideo () {
    var videoCode = $('#vimeo-video-code').val();
    var videoProvider = $('#video-provider').val();
    var videoPlayer = $('#video-player');

    if (!videoCode) { return false; }

    switch (videoProvider) {
    case 'YOUTUBE':
      videoPlayer.html('<iframe width="100%" height="600" src="/api/v1/youtube?id=' + videoCode + '"' +
                    'frameborder="0" allowfullscreen></iframe>');
      break;
    case 'VIMEO':
      videoPlayer.html('<iframe src="https://player.vimeo.com/video/' + videoCode + '"?title=0&byline=0&portrait=0" ' +
                    'width="100%" height="600" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
      break;

    default:
      break;
    }
  }

    /**
     * 윈도우 팝업창 종료 시 발생
     *
     */
  window.onbeforeunload = function (event) {
    // if (_confirm) { return confirm('진행중인 작업이 모두 사라집니다. 계속하시겠습니까?'); }
  };
});
