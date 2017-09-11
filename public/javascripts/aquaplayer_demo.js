window.requirejs([
  'common'
],
function (Util, AquaPlayerService) {
  var $ = $ || window.$;
  var isAccessible = null;

  $(function () {

  });

  $('#launch').on('click', function () {
    launch('/api/v1/aqua', {left: 0, top: 0, width: 900, height: 600, title: 'AquaNPlayer', noresize: 0});
  });

  $('#launch_html5').on('click', function () {
    launch_html5('http://eng-media-02.cdngc.net/cdnlab/cs1/tsbox/CSS_1500k.mp4');
  });

  $('#start_player').on('click', function () {
    start_player();
  });

  function launch_html5 (url) {
    var mf = window.open('/api/v1/aqua', 'AquaNPlayer', 'left=0, top=0, width=900, height=600, menubar=no, directories=no, resizable=yes, status=no, scrollbars=no');
    mf.focus();
  }

  function launch (url, options) {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
      window.alert('PC에서만 재생이 가능합니다.');
      return;
    } else if (navigator.userAgent.match(/Android/i)) {
      window.alert('PC에서만 재생이 가능합니다.');
      return;
    } else if (navigator.userAgent.match(/Mac/i)) {
      window.alert('Windows OS에서만 재생이 가능합니다.');
      return;
    }

    var params = '';
    var option;

    for (option in options) {
      params += option + '=' + options[option] + '&';
    }

    var href = 'nplayer://launch?' + params + 'url=' + encodeURIComponent(url);

    if ('ActiveXObject' in window) {
      console.log('is ActiveX');
      // old active-x player
      var mf = window.open(url, 'AquaNPlayer', 'left=0, top=0, width=900, height=600, menubar=no, directories=no, resizable=yes, status=no, scrollbars=no');
      mf.focus();
    } else {
      console.log('is not ActiveX');
      Util.launchUri(href, function () {}, function () {
        indicateDownload();
      }, function () {
        indicateDownload();
      });
    }
  }

  function checkConnection () {
    /* make sure you host a helloWorld HTML page in the following URL, so that requests are succeeded with 200 status code */
    var url = 'http://127.0.0.1:8282';
    $.ajax({
      url: url,
      type: 'get',
      cache: false,
      dataType: 'jsonp', // it is for supporting crossdomain
      crossDomain: true,
      asynchronous: true,
      jsonpCallback: 'deadCode',
      timeout: 1500, // set a timeout in milliseconds
      complete: function (xhr, responseText, thrownError) {
        if (xhr.status === '200') {
          isAccessible = true;
        } else {
          isAccessible = false;
        }
      }
    });
  }

  function launch_proxy (url, options) {
    var params = '';
    var option;

    checkConnection();
    if (isAccessible) {
      var mf = window.open(url, 'AquaNPlayer', 'left=0, top=0, width=900, height=600, menubar=no, directories=no, resizable=yes, status=no, scrollbars=no');
      mf.focus();
    } else {
      for (option in options) {
        params += option + '=' + options[option] + '&';
      }

      var href = 'aquaweb://launch?' + params + 'url=' + encodeURIComponent(url);

      Util.launchUriTmp(href, function () {
        var mf = window.open(url, 'AquaNPlayer', 'left=0, top=0, width=900, height=600, menubar=no, directories=no, resizable=yes, status=no, scrollbars=no');
        mf.focus();
      }, function () {
        indicateDownload2();
      }, function () {
        indicateDownload2();
      });
    }
  }

  function indicateDownload () {
    var nc_app_url;

    nc_app_url = window.NPLAYER_SETUP_URL;

    if (confirm('동영상을 재생하기 위해서 재생플레이어를 설치하여야 합니다.\n설치하시겠습니까?')) {
      window.location.href = window.NPLAYER_SETUP_URL;
    }
  }

  function indicateDownload2 () {
    var nc_app_url;

    nc_app_url = window.AQUAWEBAGENT_SETUP_URL;

    if (cwindow.onfirm('동영상을 재생하기 위해서 AquaWebAgent 설치가 필요합니다.\n설치하시겠습니까?')) {
      window.location.href = nc_app_url;
    }
  }

  function start_player () {
    var mtype;

    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
      mtype = 'iOS';
    } else if (navigator.userAgent.match(/Android/i)) {
      mtype = 'Android';
    } else {
      window.alert('모바일에서만 재생이 가능합니다.');
      return;
    }

    window.location.href = 'mobile/player.asp?mtype=' + mtype;
  }
});
