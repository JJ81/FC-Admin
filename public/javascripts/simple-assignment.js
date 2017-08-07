'use strict';

window.requirejs([
  'common',
  'text!../course.template.html',
  'text!../session.template.html'
], function (Util, courseTemplate, sessionTemplate) {
  var $ = undefined || window.$;
  var _ = undefined || window._;
  var assignmentId = $('#assignment_id').val();
  var activatedStep = $('#activated_step').val();
  var navListItems = $('ul.setup-panel li a');
  var allWells = $('.setup-content');
  var tableCheckAll = $('#check-all');
  var tableCourse = Util.initDataTable($('#table_course'));
  var tableEmployee = Util.initDataTable($('#table_employee'), {
    'lengthMenu': [ [5, 10, 25, 50, -1], [5, 10, 25, 50, '전체'] ]
    // 'columnDefs': [
    //   { orderable: true, targets: [0] }
    // ]
  });
  var btnDeleteSimpleAssign = $('#js-delete-simple-assign');
  var btnSaveSimpleAssign = $('#js-save-simple-assign');
  var btnSendMessage = $('.btn-send-message');
  var messageInput = $('.message');
  var courseView = window.Handlebars.compile(courseTemplate);
  var sessionView = window.Handlebars.compile(sessionTemplate);
  var windowOption = 'scrollbars=yes, toolbar=no, location=no, status=no, menubar=no, resizable=yes, width=1040, height=760, left=0, top=0';

  $(function () {
    allWells.hide();

    // DateTimePicker 설정
    Util.initDateTimePicker(
      $('.date#start_dt'),
      $('.date#end_dt')
    );

    $('ul.setup-panel li').map(function () {
      let $item = $(this);

      for (var i = 2; i <= activatedStep; i++) {
        if (i === $item.index() + 1) {
          activateStep(i);
        }
      }
    });

    if ($('#edu_id').val()) {
      getCourseList();
    }

    // 교육대상자 id 조회
    setEmployeeIds();

    sumPoint();
  });

  // 교육대상자 id 조회
  function setEmployeeIds () {
    var employeeIds = $(':checkbox:checked', tableEmployee.rows({filter: 'applied'}).nodes()).map(function () {
      return $(this).data('id');
    }).get().join(', ');
    $('input[name=\'upload_employee_ids\']').val(employeeIds);
  }

  function sumPoint () {
    var pointTotal = 0;
    $('.point-item').each(function () {
      var checked = $(this).parent().find('.input-group-addon').children('input:checkbox').prop('checked');
      if (checked && $(this).val() !== '') {
        pointTotal += parseInt($(this).val());
      }
    });

    $('.badge').text(pointTotal);
    return pointTotal;
  }

  /**
   * 윈도우 팝업창에서의 저장 작업 완료 시 호출된다.
   * @data: 갱신여부를 반환한다. true 일 경우 세션정보를 갱신한다.
   */
  window.winpop_listener = function (data) {
    getSessionList(data);
  };

  /**
   * 세션목록 조회
   * 처음 강의를 열었을 때와 세션정보가 변경되는 경우만 세션 정보를 갱신한다.
   */
  function getSessionList (refresh) {
    var selectedCourseId = $('.panel-group').data('selected-course-id');
    var $selectedPanel = $('.panel[data-id=' + selectedCourseId + ']');

    if ($selectedPanel.data('metadata').sessionLoaded === undefined || refresh) {
      window.axios.get('/course/' + selectedCourseId)
      .then(function (res) {
        if (res.data) {
          $selectedPanel.find('.session-content').html(getSessionView({ session_list: res.data.session_list }));
          $selectedPanel.data('metadata').sessionLoaded = true;

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
          }).disableSelection();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  /**
   * 강의목록 조회
   */
  function getCourseList () {
    var eduId = $('#edu_id').val();

    window.axios.get('/education/' + eduId + '/courses')
    .then(function (res) {
      if (res.data) {
        $.each(res.data.edu_course_list, function (index, data) {
          $('#course-list').append(getCourseView(data));
          $('.panel').last().data('metadata', data);
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  tableCheckAll.bind('click', function () {
    $(':checkbox', tableEmployee.rows().nodes()).prop('checked', this.checked);
  });

  navListItems.click(function (e) {
    e.preventDefault();
    var $target = $($(this).attr('href'));
    var $item = $(this).closest('li');

    if (!$item.hasClass('disabled')) {
      navListItems.closest('li').removeClass('active');
      $item.addClass('active');
      allWells.hide();
      $target.show();
    }
  });

  if (activatedStep > 1) {
    var activatedPanel = 'ul.setup-panel li a:eq(' + (activatedStep - 1).toString() + ')';
    $(activatedPanel).click();
  } else {
    $('ul.setup-panel li.active a').trigger('click');
  }

  function activateStep (step) {
    var currSelector = 'ul.setup-panel li:eq(' + (parseInt(step) - 1) + ')';
    var nextSelector = 'ul.setup-panel li a[href="#step-' + step + '"]';

    $(currSelector).removeClass('disabled');
    $(nextSelector).trigger('click');

    // updateProgress(step);
  }

  // 1. 교육생 설정
  $('.step1 > .next > a').on('click', function (e) {
    e.preventDefault();
    if (validateStep1()) {
      if (!window.confirm('저장하시겠습니까?')) return false;
      activateStep(2);
      saveStep1Data();
    }
  });
  $('.step2 > .previous > a').on('click', function (e) {
    e.preventDefault();
    activateStep(1);
  });
  // 2. 교육과정 개설
  $('.step2 > .next > a').on('click', function (e) {
    e.preventDefault();
    if (validateStep2()) {
      if (!window.confirm('저장하시겠습니까?')) return false;
      activateStep(3);
      saveStep2Data();
    }
  });
  $('.step3 > .previous > a').on('click', function (e) {
    e.preventDefault();
    activateStep(2);
  });
  // 3. 강의 개설
  $('.step3 > .next > a').on('click', function (e) {
    e.preventDefault();
    activateStep(4);
    // updateProgress(3);
  });
  $('.step4 > .previous > a').on('click', function (e) {
    e.preventDefault();
    activateStep(3);
  });

  $('.panel-collapse').on('hide.bs.collapse', function () {
    $('.panel-collapse-clickable').find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
  });

  $('.panel-collapse').on('show.bs.collapse', function () {
    $('.panel-collapse-clickable').find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
  });

  btnDeleteSimpleAssign.on('click', deleteAssignment);
  btnSaveSimpleAssign.on('click', function () {
    // updateProgress($('ul.setup-panel li.active').index() + 1);
    var step = $('ul.setup-panel li.active').index() + 1;

    if (!window.confirm('저장하시겠습니까?')) return false;
    switch (step) {
    case 1:
      if (validateStep1()) {
        saveStep1Data();
      }
      break;
    case 2:
      if (validateStep2()) {
        saveStep2Data();
      }
      break;
    default:
      break;
    }
  });

  function updateProgress (step) {
    window.axios.post('/simple_assignment/progress', {
      step: step,
      id: assignmentId
    })
    .then(function (response) {
      activatedStep(step);
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });
  }

  /**
   * 교육 대상자를 저장한다.
   */
  function saveStep1Data () {
    var formData = new window.FormData();
    formData.append('upload_type', $('input[name=\'upload_type\']').val());
    formData.append('upload_employee_ids', $('input[name=\'upload_employee_ids\']').val());
    formData.append('file-excel', document.getElementById('UploadExcelFile').files[0]);
    formData.append('group_name', '간편배정');
    formData.append('redirect', false);
    formData.append('id', assignmentId);
    formData.append('log_bind_user_id', $('#log_bind_user_id').val());

    window.axios.post('/assignment/upload', formData)
      .then(function (res) {
        if (res.data) {
          // $('input[name=\'upload_employee_ids\']').val(res.data.employeeIds);
          $('#log_bind_user_id').val(res.data.logBindUserId);
          window.alert('교육생을 저장하였습니다.');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * 교육과정 정보, 포인트 및 교육기간 정보를 저장한다.
   */
  function saveStep2Data () {
    var data = {
      'name': $('input[name=\'course_name\']').val(),
      'desc': window.tinymce.activeEditor.getContent(),
      'complete_point': $('input[name=\'complete_point\']').val(),
      'quiz_point': $('input[name=\'quiz_point\']').val(),
      'test_point': $('input[name=\'test_point\']').val(),
      'reeltime_point': $('input[name=\'reeltime_point\']').val(),
      'speed_point': $('input[name=\'speed_point\']').val(),
      'reps_point': $('input[name=\'reps_point\']').val(),
      'start_dt': $('input[name=\'start_dt\']').val(),
      'finish_dt': $('input[name=\'finish_dt\']').val(),
      'assigment_id': assignmentId,
      'upload_employee_ids': $('input[name=\'upload_employee_ids\']').val(),
      'edu_id': $('#edu_id').val(),
      'log_bind_user_id': $('#log_bind_user_id').val(),
      'training_edu_id': $('#training_edu_id').val(),
      'can_replay': $('#can-replay').prop('checked') ? 1 : 0
    };

    // console.log(data);
    // return false;

    window.axios.post('/education', data)
    .then(function (res) {
      // console.log(res);
      if (res.data) {
        $('#training_edu_id').val(res.data.trainingEduId);
        $('#edu_id').val(res.data.eduId);
        window.alert('교육과정을 저장하였습니다.');
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function deleteAssignment () {
    if (!window.confirm('정말 삭제하시겠습니까?')) return false;

    var params = {
      id: assignmentId,
      log_bind_user_id: $('#log_bind_user_id').val(),
      edu_id: $('#edu_id').val()
    };

    window.axios.delete('/simple_assignment',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          window.alert('배정내역을 삭제하지 못하였습니다.');
        } else {
          window.alert('교육과정을 삭제하였습니다.');
          window.location.href = '/simple_assignment';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * 1. 교육 대상자 선택
   */
  function validateStep1 () {
    var currentTabId = $('ul.select-employee li.active').children().attr('id');
    var data = null;

    $('input[name=\'upload_type\']').val(currentTabId);

    switch (currentTabId) {
    case 'employee': // 등록된 직원
      data = $(':checkbox:checked', tableEmployee.rows({filter: 'applied'}).nodes()).map(function () {
        return $(this).data('id');
      }).get().join(', ');

      if (!data) {
        window.alert('직원을 선택하세요.');
        return false;
      }

      $('input[name=\'upload_employee_ids\']').val(data);
      break;

    case 'excel': // 파일업로드
      if (document.getElementById('UploadExcelFile').files.length === 0) {
        $('#UploadExcelFile').focus();
        window.alert('파일을 선택하세요.');
        return false;
      }
      break;

    default:
      break;
    }

    return true;
  }

  /**
   * 2. 교육과정 입력
   */
  function validateStep2 () {
    var $eduName = $('input[name=\'course_name\']');
    var $eduDescription = $('#input-course-desc').val(); // window.tinymce.activeEditor.getContent();

    if ($eduName.val() === '') {
      window.alert('교육과정명을 입력하세요.');
      $eduName.focus();
      return false;
    }

    if ($eduDescription === '') {
      window.alert('교육과정에 대한 설명을 입력하세요.');
      window.tinymce.execCommand('mceFocus', false, 'input-course-desc');
      return false;
    }

    var pointIsValid = true;
    var pointTotal = 0;
    $('.point-item').each(function () {
      var checked = $(this).parent().find('.input-group-addon').children('input:checkbox').prop('checked');
      // console.log('$(this).val()', checked, $(this).val());
      if (checked) {
        if ($(this).val() === '') {
          window.alert($(this).prop('placeholder') + ' 포인트 점수를 입력하세요.');
          $(this).focus();
          pointIsValid = false;
          return false;
        } else {
          pointTotal += parseInt($(this).val());
        }
      }
    });

    console.log('pointTotal', pointTotal, pointIsValid);
    if (!pointIsValid) return false;
    if (pointTotal !== 100) {
      window.alert('포인트의 합계는 100점이 되어야 합니다.');
      return false;
    }

    return true;
  }

  $('.input-group-addon').children('input:checkbox').on('change', function () {
    var input = $(this).parent().parent().find('.point-item');

    input.prop('disabled', !$(this).prop('checked'));

    if ($(this).prop('checked')) {
      input.focus();
    };
  });

  $('.point-item').on('keyup', _.debounce(function () {
    var sum = 0;

    $('.point-item').each(function () {
      var checked = $(this).parent().find('.input-group-addon').children('input:checkbox').prop('checked');
      if (checked && $(this).val() !== '' && $(this).val() !== '0') {
        var point = parseInt($(this).val());
        sum += point;
      } else {
        // $(this).prop('disabled', true);
        // $(this).parent().find('.input-group-addon').children('input:checkbox').prop('checked', false);
      }
    });

    if (sum > 0) {
      $('.badge').text(sum);
    }

    if (sum > 100) {
      window.alert('100점을 초과하였습니다.');
      return false;
    }
  }, 300));

  function getCourseView (data) {
    return courseView(data);
  }

  function getSessionView (data) {
    return sessionView(data);
  }

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

    window.axios.all(promises).then(function (results) {
      results.forEach(function (response) {
        console.log(response);
      });
    });
  }

  function toggleIcon (e) {
    $(e.target)
      .prev('.panel-heading')
      .find('.more-less')
      .toggleClass('glyphicon-plus glyphicon-minus');

    // panel-group 에 현재 편집중인 강의 id 를 입력한다.
    var $panelGroup = $(e.target).parents().find('.panel-group');
    var selectedCourseId = $(e.target).parents().closest('.panel').data('id');

    if ($panelGroup.data('selected-course-id') !== selectedCourseId) {
      $panelGroup.data('selected-course-id', selectedCourseId);
      getSessionList();
    }
  }

  function addCourse () {
    var $modal = $('#registerCourse');
    var data = {
      course_name: $modal.find('input[name=\'course_name\']').val(),
      course_desc: window.tinymce.activeEditor.getContent(),
      teacher_name: $modal.find('input[name=\'teacher_name\']').val(),
      edu_id: $('#edu_id').val()
    };

    window.axios.post('/course', data)
    .then(function (res) {
      if (res.data) {
        if ($('#course-list').children().length === 0) {
          var currSelector = 'ul.setup-panel li:eq(3)'; // 4. 메세지
          $(currSelector).removeClass('disabled');
          updateProgress(4);
        }
        $('#course-list').append(getCourseView(res.data));
        $('.panel').last().data('metadata', res.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function updateCourse () {
    var $modal = $('#modifyCourse');
    var selectedCourseId = $('.panel-group').data('selected-course-id');
    var data = {
      course_id: selectedCourseId,
      course_name: $modal.find('input[name=\'course_name\']').val(),
      course_desc: window.tinymce.activeEditor.getContent(),
      teacher_name: $modal.find('input[name=\'teacher_name\']').val(),
      course_rate: 0,
      teacher_rate: 0
    };

    window.axios.put('/course', data)
    .then(function (res) {
      if (res.data) {
        // console.log(res.data);
        $('.panel[data-id=' + res.data.course_id + ']').replaceWith(getCourseView(res.data));
        $('.panel[data-id=' + res.data.course_id + ']').data('metadata', res.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function onModifyCourseModalOpen (e) {
    var data = $(e.relatedTarget).parents().find('.panel').data('metadata');
    var $modal = $(this);

    $modal.find('input').val('').end();
    window.tinymce.activeEditor.setContent('');
    $modal.find('input[name=\'course_name\']').val(data.course_name);
    $modal.find('input[name=\'teacher_name\']').val(data.teacher_name);
    window.tinymce.get('course_desc').setContent(data.course_desc);
    $modal.find('[autofocus]').focus();
  }

  $('#registerCourse').submit(function (e) {
    e.preventDefault();

    addCourse();

    window.tinymce.execCommand('mceFocus', false, 'course_desc');
    $(this).modal('toggle');
  });
  $('#modifyCourse').submit(function (e) {
    e.preventDefault();

    updateCourse();

    window.tinymce.execCommand('mceFocus', false, 'course_desc');
    $(this).modal('toggle');
  });

  $('.panel-group').on('hidden.bs.collapse', toggleIcon);
  $('.panel-group').on('shown.bs.collapse', toggleIcon);
  $('#registerCourse').on('hidden.bs.modal', function () {
    $(this).find('input').val('').end();
    window.tinymce.activeEditor.setContent('');
  });
  $('#registerCourse').on('shown.bs.modal', function () {
    $(this).find('[autofocus]').focus();
  });
  $('#modifyCourse').on('shown.bs.modal', onModifyCourseModalOpen);
  // $('#modifyCourse').on('hidden.bs.modal', onModifyCourseModalClose);

  // 비디오 생성하기
  $('.panel-group').on('click', '.btn-create-video', function (e) {
    e.preventDefault();
    var courseId = $(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/video?course_id=' + courseId, 'Video', windowOption);
  });
  // 퀴즈 생성하기
  $('.panel-group').on('click', '.btn-create-quiz', function (e) {
    e.preventDefault();

    var courseId = $(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/quiz?course_id=' + courseId + '&type=QUIZ', 'Quiz', windowOption);
  });
  // 파이널테스트 생성하기
  $('.panel-group').on('click', '.btn-create-final', function (e) {
    e.preventDefault();

    var courseId = $(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/quiz?course_id=' + courseId + '&type=FINAL', 'Final', windowOption);
  });
  // 파이널테스트 생성하기
  $('.panel-group').on('click', '.btn-create-checklist', function (e) {
    e.preventDefault();

    var courseId = $(this).attr('data-course-id');
    Util.createWindowPopup('/course/create/checklist?course_id=' + courseId + '&type=CHECK', 'Checklist', windowOption);
  });
  // 세션을 삭제한다.
  $('.panel-group').on('click', '.btn-delete-session', function (e) {
    e.preventDefault();

    if (!window.confirm('삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')) {
      return false;
    }

    var $self = $(this);
    var params = {};
    params.course_list_id = $(this).parent('span').data('course-list-id');
    params.course_list_type = $(this).parent('span').data('type');

    var courselistType = $(this).parent('span').data('type');
    switch (courselistType) {
    case 'QUIZ':
    case 'FINAL':
      params.quiz_group_id = $(this).data('quiz-group');
      break;
    case 'VIDEO':
      params.video_id = $(this).data('video-id');
      break;
    case 'CHECKLIST':
      params.checklist_group_id = $(this).data('checklist-group');
      break;
    default:
      break;
    }

    window.axios.delete('/course/courselist',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          window.alert('진행한 이력이 있어 세션을 삭제하지 못했습니다. 관리자에게 문의해주시기 바랍니다.');
        } else {
          window.alert('세션을 삭제하였습니다.');
          $self.parents('li').remove();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // 세션 수정하기
  $('.panel-group').on('click', '.btn-modify-session', function (e) {
    e.preventDefault();

    var dataCourseId = $(this).parent('span').data('course-id');
    var dataCourseListId = $(this).parent('span').data('course-list-id');
    var dataVideoId = $(this).data('video-id');
    var dataQuizGroupId = $(this).data('quiz-group');
    var dataChecklistGroupId = $(this).data('checklist-group');
    var dataType = $(this).parent('span').data('type'); // VIDEO/QUIZ/FINAL

    if (dataType === 'VIDEO') {
      Util.createWindowPopup('/course/modify/video?course_id=' + dataCourseId + '&course_list_id=' + dataCourseListId + '&video_id=' + dataVideoId, 'Video', windowOption);
    } else if (dataType === 'QUIZ' || dataType === 'FINAL') {
      Util.createWindowPopup('/course/modify/quiz?course_id=' + dataCourseId + '&course_list_id=' + dataCourseListId + '&type=' + dataType + '&quiz_group_id=' + dataQuizGroupId, 'Quiz', windowOption);
    } else if (dataType === 'CHECKLIST') {
      Util.createWindowPopup('/course/modify/checklist?course_id=' + dataCourseId + '&course_list_id=' + dataCourseListId + '&type=' + dataType + '&checklist_group_id=' + dataChecklistGroupId, 'Checklist', windowOption);
    }
  });

  // 체크리스트 보기
  $('.panel-group').on('click', '.btn-preview-checklist', function (e) {
    e.preventDefault();
    var courseListId = window.$(this).parent('span').data('course-list-id');
    if (!courseListId) {
      courseListId = window.$(this).data('id');
    }
    Util.createWindowPopup('/course/checklist?course_list_id=' + courseListId, 'Checklist', windowOption);
  });

  // 퀴즈 풀어보기
  $('.panel-group').on('click', '.btn-solve-quiz', function (e) {
    e.preventDefault();

    var quizGroupId = window.$(this).attr('data-quiz-group');
    var dataTitle = window.$(this).attr('data-title');
    var dataType = window.$(this).attr('data-type');

    Util.createWindowPopup('/course/quiz?id=' + quizGroupId + '&title=' + dataTitle + '&type=' + dataType, 'Quiz', windowOption);
  });

  // 비디오 보기
  $('.panel-group').on('click', '.btn-watch-video', function (e) {
    e.preventDefault();

    // 비디오 아이디를 추출
    var videoId = window.$(this).attr('data-video-id');
    Util.createWindowPopup('/course/video?id=' + videoId, 'Video', windowOption);
  });

  $('.panel-group').on('click', '.btn-delete-course', function () {
    if (window.confirm('선택하신 강의를 삭제하시겠습니까?')) {
      var selectedCourseId = $('.panel-group').data('selected-course-id');

      window.axios.delete('/course/deactivate', { params: { id: selectedCourseId } })
      .then(function (res) {
        if (res.data.success) {
          $('.panel[data-id=' + selectedCourseId + ']').remove();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  });

  btnSendMessage.on('click', function (e) {
    e.preventDefault();

    var currentTabId = $('ul.select-employee li.active').children().attr('id');
    var checkedEmployeeIds;
    switch (currentTabId) {
    case 'employee':
      checkedEmployeeIds = window.$(':checkbox:checked',
        tableEmployee.rows({filter: 'applied'}).nodes()).map(
          function () {
            return tableEmployee.row(window.$(this).parents('tr')).data()[4];
          }
        ).get().join(',');
      break;
    case 'employee-assigned':
      // checkedEmployeeIds = window.$(':checkbox:checked',
      //   tableAssignedEmployee.rows({filter: 'applied'}).nodes()).map(
      //     function () {
      //       return tableAssignedEmployee.row(window.$(this).parents('tr')).data()['user_phone'];
      //     }
      //   ).get().join(',');
      break;
    default:
      break;
    }

    if (!checkedEmployeeIds) {
      window.alert('직원을 선택하세요.');
      return false;
    }

    var message = messageInput.val().trim();
    if (message === '') {
      window.alert('메세지를 입력하세요.');
      messageInput.focus();
      return false;
    }

    if (!window.confirm('메세지를 보내시겠습니까?')) {
      return false;
    }

    window.axios({
      method: 'post',
      url: '/api/v1/sms/send',
      data: {
        phones: checkedEmployeeIds,
        msg: message
      }
    })
    .then(
      function (res) {
        if (res.data.success === true) {
          window.alert('메세지를 전송하였습니다.');
        } else {
          window.alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
        }
      });
  });
});
