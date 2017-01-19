'use strict';

requirejs([
    'jquery'
], function($) {

    var _btn_regist_video = $('#regist-video');
    var _btn_play_video = $('#play-video');
    var _confirm = true; // 윈도우 종료 시 창을 닫을지 여부

    $('#video-code').bind('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13)
            displayVideo();
    });
    
    _btn_play_video.bind('click', function (e) {        
        displayVideo();
    });

    _btn_regist_video.bind('click', function (e) {
        e.preventDefault();

        if (!validateForm())
            return false;

        if (!confirm("저장하시겠습니까?"))
            return false;

        var params = $("form").serialize();
        $.ajax({
            url: $("form").attr('action'),
            type: 'POST',
            data: params,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8', 
            dataType: 'html',
            success: function (response) {
                alert('비디오를 저장하였습니다.'); 
                window.parent.opener.location.reload(); // 부모폼을 reload 한다.

                _confirm = false;
                window.close();
            }
        });
    });

    /**
     * 폼 validate
     */
    function validateForm() {

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

        if (!video_code)
            return false;
        
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
        if (_confirm)
            return confirm("진행중인 작업이 모두 사라집니다. 계속하시겠습니까?");
    };    

});