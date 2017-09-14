'use strict';

window.requirejs([
  'common',
  'Vimeo'
],
function (Util, Vimeo) {
  var $ = $ || window.$;
  var player = null;
  // var playerContainer = $('#videoplayer');
  var btnRegistVideo = $('#regist-video');
  var btnPlayVideo = $('#play-video');
  var _confirm = true; // 윈도우 종료 시 창을 닫을지 여부
  var $selectVideoProvider = $('#video-provider');
  var $setAquaPlayer = $('.aquaplayer-settings');
  var $setVimeoPlayer = $('.vimeo-settings');
  var $aquaPlayerFrame = $('#aquaplayer_frame');

  window.$(function () {
    // console.log('hello!');
    // window.alert(window.parent.opener);
    // window.parent.opener.winpop_listener();
    $aquaPlayerFrame.attr('src', '/api/v1/aqua?os=' + Util.getOSName() + '&video_id=148');
  });

  $selectVideoProvider.on('change', function () {
    var option = $(this).val();

    if (option === 'VIMEO') {
      $setVimeoPlayer.removeClass('blind');
      $setAquaPlayer.addClass('blind');
    } else if (option === 'AQUA') {
      $setAquaPlayer.removeClass('blind');
      $setVimeoPlayer.addClass('blind');
    }
  });

  /**
   * Player 를 초기화 한다.
   */
  function initPlayer () {
    var videoUrl = $('#video-code').val();
    var options = {
      url: videoUrl,
      loop: false
    };

    if (player) {
      player.unload().then(function () {
        console.info(player);
        player.loadVideo('157991194');
      }).catch(function (error) {
        console.log('비메오 오류발생!');
        console.error(error);
      });
    } else {
      player = new Vimeo('videoplayer', options);
      player.setVolume(0.5);
      player.on('error', function (data) {
        console.log('비메오 오류발생!');
        console.error(data);
      });
    }
  }

  $('#video-code').bind('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { displayVideo(); }
            // initPlayer();
  });

  btnPlayVideo.bind('click', function (e) {
    displayVideo();
        // initPlayer();
  });

  btnRegistVideo.bind('click', function (e) {
    e.preventDefault();

    if (!validateForm()) { return false; }

    if (!window.confirm('저장하시겠습니까?')) { return false; }

    var params = $('form').serialize();
    $.ajax({
      url: $('form').attr('action'),
      type: 'POST',
      data: params,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      dataType: 'html',
      success: function (response) {
        window.alert('비디오를 저장하였습니다.');
        // window.parent.opener.location.reload(); // 부모폼을 reload 한다.
        window.parent.opener.winpop_listener(true);

        _confirm = false;
        window.close();
      }
    });
  });

    /**
     * 폼 validate
     */
  function validateForm () {
    var video_title = $('#video-title');
    var video_code = $('#video-code');

    if (!video_title.val()) {
      alert('비디오 강좌명을 입력하세요.');
      video_title.focus();
      return false;
    }
    if (!video_code.val()) {
      alert('비디오 코드를 입력하세요.');
      video_code.focus();
      return false;
    }

    return true;
  }

    /**
     * 비디오를 표시한다.
     */
  function displayVideo () {
    var video_code = $('#video-code').val();
    var video_provider = $('#video-provider').val();
    var video_player = $('#video-player');

    if (!video_code) { return false; }

    switch (video_provider) {
    case 'YOUTUBE':
      video_player.html('<iframe width="100%" height="600" src="https://www.youtube.com/embed/' + video_code + '"' +
                    'frameborder="0" allowfullscreen></iframe>');
      break;
    case 'VIMEO':
      video_player.html('<iframe src="https://player.vimeo.com/video/' + video_code + '"?title=0&byline=0&portrait=0" ' +
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
    if (_confirm) { return confirm('진행중인 작업이 모두 사라집니다. 계속하시겠습니까?'); }
  };
});
