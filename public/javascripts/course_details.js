'use strict';
window.requirejs(
  [
    'common'
  ],
function (Util) {
  var $ = $ || window.$;
  var windowOption = 'scrollbars=yes, toolbar=no, location=no, status=no, menubar=no, ' +
      'resizable=yes, width=1040, height=760, left=0, top=0';
  var btnWatch = window.$('.btn-watch-video');
  var btnSolveQuiz = window.$('.btn-solve-quiz'); // 퀴즈/파이널테스트 보기
  var btnPreviewChecklist = window.$('.btn-preview-checklist'); // 체크리스트 보기
  var btnCreateVideo = window.$('.btn-create-video'); // 비디오 보기
  // var btnModifyVideo = window.$('.btn-modify-video'); // 비디오 수정
  var btnCreateQuiz = window.$('.btn-create-quiz'); // 퀴즈 생성
  var btnCreateFinalQuiz = window.$('.btn-create-final'); // 파이널테스트 생성
  var btnCreateChecklist = window.$('.btn-create-checklist'); // 파이널테스트 생성
  var btnDeleteSession = window.$('.btn-delete-session'); // 세션 삭제버튼
  var btnModifySession = window.$('.btn-modify-session'); // 세션 수정버튼
  var btnDeleteCourse = window.$('#btnDeleteCourse'); // 강의 삭제 버튼

  window.$(function () {
      // jQuery UI sortable 초기화
    $('.list-group').sortable({
      connectWith: '.list-group-item',
      start: function (e, ui) {
        $(this).attr('data-previndex', ui.item.index());
      },
      update: function (e, ui) {
        // var newIndex = ui.item.index();
        // var oldIndex = window.$(this).attr('data-previndex');
        // window.console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
        $(this).removeAttr('data-previndex');
        changeSessionOrder();
      }
    });
    // window.$('.course-session').sortable({
    //   placeholder: 'sort-highlight',
    //   handle: '.handle',
    //   forcePlaceholderSize: true,
    //   zIndex: 999999,
    //   start: function (e, ui) {
    //     window.$(this).attr('data-previndex', ui.item.index());
    //   },
    //   update: function (e, ui) {
    //     // var newIndex = ui.item.index();
    //     // var oldIndex = window.$(this).attr('data-previndex');
    //     // window.console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
    //     window.$(this).removeAttr('data-previndex');
    //     changeSessionOrder();
    //   }

    window.winpop_listener = function (data) {
      if (data === true) {
        window.location.reload(true);
      }
    };
  });

  /**
   * DB 에서 세션 순서를 변경한다.
   */
  function makeSessionOrderChangeRequest (session) {
    return window.axios({
      method: 'put',
      url: '/course/courselist',
      data: {
        title: session.children('a').data('title'),
        course_list_id: session.children('a').data('id'),
        course_list_order: session.index()
      }
    });
  }

  /**
   * 세션순서를 변경한다.
   */
  function changeSessionOrder () {
    var promises = [];
    var items = window.$('.session-content > .list-group-item');

    for (var index = 0; index < items.length; index++) {
      promises.push(makeSessionOrderChangeRequest(window.$(items[index])));
    }

    window.axios.all(promises)
    .then(window.axios.spread(function (acct, perms) {
      if (acct.data.success) {
        window.alert('세션순서를 변경하였습니다.');
      }
    }));
  }

  // 체크리스트 보기
  btnPreviewChecklist.bind('click', function (e) {
    e.preventDefault();
    var courseListId = window.$(this).parent('span').data('course-list-id');
    if (!courseListId) {
      courseListId = window.$(this).data('id');
    }
    Util.createWindowPopup('/course/checklist?course_list_id=' + courseListId, 'Checklist', windowOption);
  });

  // 비디오 보기
  btnWatch.bind('click', function (e) {
    e.preventDefault();

    // 비디오 아이디를 추출
    var videoId = window.$(this).attr('data-video-id');
    Util.createWindowPopup('/course/video?id=' + videoId, 'Video', windowOption);
  });

  // 강의 삭제하기
  btnDeleteCourse.bind('click', function () {
    if (!window.confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {
      id: window.$(this).data('course-id')
    };

    window.axios.delete('/course/deactivate',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          window.alert('강의를 삭제하였습니다.');
        } else {
          window.alert('강의를 삭제하였습니다.');
          window.location.href = '/course';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // 비디오 생성하기
  btnCreateVideo.bind('click', function (e) {
    e.preventDefault();

    var courseId = window.$(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/video?course_id=' + courseId, 'Video', windowOption);
  });

  // 퀴즈 풀어보기
  btnSolveQuiz.bind('click', function (e) {
    e.preventDefault();

    var quizGroupId = window.$(this).attr('data-quiz-group');
    var dataTitle = window.$(this).attr('data-title');
    var dataType = window.$(this).attr('data-type');

    Util.createWindowPopup('/course/quiz?id=' + quizGroupId + '&title=' + dataTitle + '&type=' + dataType, 'Quiz', windowOption);
  });

  // 퀴즈 생성하기
  btnCreateQuiz.bind('click', function (e) {
    e.preventDefault();

    var courseId = window.$(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/quiz?course_id=' + courseId + '&type=QUIZ', 'Quiz', windowOption);
  });

  // 파이널테스트 생성하기
  btnCreateFinalQuiz.bind('click', function (e) {
    e.preventDefault();

    var courseId = window.$(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/quiz?course_id=' + courseId + '&type=FINAL', 'Final', windowOption);
  });

  // 파이널테스트 생성하기
  btnCreateChecklist.bind('click', function (e) {
    e.preventDefault();

    var courseId = window.$(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/checklist?course_id=' + courseId + '&type=CHECK', 'Checklist', windowOption);
  });

  /**
   * 세션관련정보를 삭제한다.
   * 주의사항:
   * 세션과 관련된 일체를 실제 삭제하는 기능이므로, 꼭 필요한 경우에만 사용하도록 할 필요가 있다.
   * 1. 세션정보(course_list) 삭제
   * 2. 퀴즈 보기(quiz_option) 삭제
   * 3. 퀴즈(quiz) 를 삭제한다.
   * 4. 퀴즈 보기 그룹(quiz_group) 삭제
   */
  function deleteSession (params) {
    window.axios.delete('/course/courselist',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          window.alert('진행한 이력이 있어 세션을 삭제하지 못했습니다. 관리자에게 문의해주시기 바랍니다.');
        } else {
          window.alert('세션을 삭제하였습니다.');
          window.location.reload();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * 세션을 삭제한다.
   *
   */
  btnDeleteSession.bind('click', function (e) {
    e.preventDefault();

    if (!window.confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var params = {};
    params.course_list_id = window.$(this).parent('span').data('course-list-id');
    params.course_list_type = window.$(this).parent('span').data('type');

    var courselistType = window.$(this).parent('span').data('type');
    switch (courselistType) {
    case 'QUIZ':
    case 'FINAL':
      params.quiz_group_id = window.$(this).data('quiz-group');
      break;
    case 'VIDEO':
      params.video_id = window.$(this).data('video-id');
      break;
    case 'CHECKLIST':
      params.checklist_group_id = window.$(this).data('checklist-group');
      break;
    default:
      break;
    }
    deleteSession(params);
  });

  /**
   * 세션 수정하기
   */
  btnModifySession.bind('click', function (e) {
    e.preventDefault();

    var dataCourseId = window.$(this).parent('span').data('course-id');
    var dataCourseListId = window.$(this).parent('span').data('course-list-id');
    var dataVideoId = window.$(this).data('video-id');
    var dataQuizGroupId = window.$(this).data('quiz-group');
    var dataChecklistGroupId = window.$(this).data('checklist-group');
    var dataType = window.$(this).parent('span').data('type'); // VIDEO/QUIZ/FINAL

    if (dataType === 'VIDEO') {
      Util.createWindowPopup('/course/modify/video?course_id=' + dataCourseId + '&course_list_id=' + dataCourseListId + '&video_id=' + dataVideoId, 'Video', windowOption);
    } else if (dataType === 'QUIZ' || dataType === 'FINAL') {
      Util.createWindowPopup('/course/modify/quiz?course_id=' + dataCourseId + '&course_list_id=' + dataCourseListId + '&type=' + dataType + '&quiz_group_id=' + dataQuizGroupId, 'Quiz', windowOption);
    } else if (dataType === 'CHECKLIST') {
      Util.createWindowPopup('/course/modify/checklist?course_id=' + dataCourseId + '&course_list_id=' + dataCourseListId + '&type=' + dataType + '&checklist_group_id=' + dataChecklistGroupId, 'Checklist', windowOption);
    }
  });

  /**
   * DB 에서 세션 순서를 변경한다.
   */
  // function makeSessionOrderChangeRequest (session) {
  //   return window.axios({
  //     method: 'put',
  //     url: '/course/courselist',
  //     data: {
  //       title: session.children().children('a').data('title'),
  //       course_list_id: session.children().children('a').data('id'),
  //       course_list_order: session.index()
  //     }
  //   });
  // }

  // /**
  //  * 세션순서를 변경한다.
  //  */
  // function changeSessionOrder () {
  //   var promises = [];
  //   var items = window.$('.session-list');

  //   for (var index = 0; index < items.length; index++) {
  //     promises.push(makeSessionOrderChangeRequest(window.$(items[index])));
  //   }

  //   window.axios.all(promises).then(function (results) {
  //     results.forEach(function (response) {
  //     });
  //   });
  // }
});
