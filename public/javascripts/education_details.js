/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs([
  'common'
],
function (Util) {
  var btnModifyEdu = $('.btn-modify-edu');            // 교육과정 수정버튼
  var btnDeleteEducation = $('#btnDeleteEducation');  // 교육과정 삭제버튼
  var btnAddEduCourse = $('#btn-add-course-edu');     // 강의추가 버튼
  var selectCourseList = $('#select-course-list');    // 추가할 강의 리스트
  var courseContainer = $('#draggablePanelList');     // 추가된 강의 목록
  // 포인트 가중치 설정 관련 변수
  var pointTotal = 0;
  var frmPointWeight = $('#frm_point_weight');
  var pointWeightForm = $('#pointWeight');
  var totalPoint = $('.total_point');
  var btnRegisterPointWeight = $('.btn-register-point-weight');

  // 초기 설정
  $(function () {
      // jQuery UI sortable 초기화
      $('#draggablePanelList').sortable({
          placeholder: "sort-highlight",
          handle: ".handle",
          forcePlaceholderSize: true,
          zIndex: 999999,
          start: function(e, ui) {
              $(this).attr('data-previndex', ui.item.index());
          },
          update: function(e, ui) {
              var newIndex = ui.item.index();
              var oldIndex = $(this).attr('data-previndex');
              $(this).removeAttr('data-previndex');
              console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);
          }
      });

      // DateTimePicker 설정
      var start_dt = moment().format();
      var end_dt = moment().add(6, 'days');

      // 교육 시작일자
      $('#start_dt').datetimepicker({
          defaultDate: start_dt,
          format: 'YYYY-MM-DD',
          showTodayButton: true
      });

      // 교육 종료일자
      $('#end_dt').datetimepicker({
          defaultDate: end_dt,
          format: 'YYYY-MM-DD',
          useCurrent: false,
          showTodayButton: true
      });

      // 날짜가 서로 겹치지 않도록 설정한다.
      $("#start_dt").on("dp.change", function (e) {
          $('#end_dt').data("DateTimePicker").minDate(e.date);
      });
      $("#end_dt").on("dp.change", function (e) {
          $('#start_dt').data("DateTimePicker").maxDate(e.date);
      });

      tinymce.init({
          selector: '.course-desc'
      });

  });

  // 교육과정 삭제하기
  btnDeleteEducation.bind('click', function () {
    if (!confirm("삭제 시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?")) {
      return false;
    }

    var params = {
      edu_id: $(this).data('edu-id')
    };

    axios.delete('/education/deactivate',
      {
        params: params
      })
      .then(function (response) {
        if (!response.data.success) {
          alert("교육과정을 삭제하였습니다.");
        } else {
          alert("교육과정을 삭제하였습니다.");
          location.href = '/education';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  // 교육과정 수정
  btnModifyEdu.bind('click', function () {
    var eduName = $('.course-name')
    var eduDesc = tinymce.activeEditor.getContent();
    var courseGroupList = makeCourseGroupList();

    if (eduName.val() == '') {
      alert('교육과정명을 입력하세요.')
      eduName.focus();
      return false;
    }

    if (eduDesc === ''){
      alert('교육과정 소개를 입력해주세요.')
      eduDesc.focus();
      return false;
    }

    if (!courseGroupList.valid_course_count) {
      alert('강의를 추가해주세요.');
      return false;
    }

    if (!confirm("수정하시겠습니까?")) {
      return false;
    }

    axios({
      method: 'put',
      url: '/education/modify/edu',
      data : {
        id: $('#edu_id').val(),
        name : eduName.val().trim(),
        desc : eduDesc,
        courseGroupList : courseGroupList.data,
        start_dt: $('#start_dt').find("input").val() + ' ' + '00:00:00',
        end_dt: $('#end_dt').find("input").val() + ' ' + '23:59:59'
      }
    }).then(function (res) {
      if (res.data.success == true) {
        alert('교육과정을 수정하였습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
      }
      window.location.reload();
    });
  });

  // 강의그룹 데이터를 생성한다.
  function makeCourseGroupList () {
      var courseGroupList = [];
      var order = 0;
      var mode = "";
      var valid_course_count = 0;

      $('#draggablePanelList').find('li.list-group-item').each(function (index) {
          var course_group = {
              id: $(this).data('course-group-id'),
              course_id: $(this).data('course-id'),
              course_group_id: $(this).data('course-group-key'),
              order: order
          };

          if (course_group.id)
              {if ($(this).is(":visible")) 
                  course_group.mode = "UPDATE";
              else
                  course_group.mode = "DELETE";}
          else
              {course_group.mode = "INSERT";}

          courseGroupList.push(course_group);

          if (course_group.mode !== "DELETE") {
              valid_course_count += 1;
              order += 1;
          }

      });

      return { data: courseGroupList, valid_course_count: valid_course_count };
  }

  // 강의 삭제
  $('.btn-delete-course').bind('click', function () {
    // API 삭제 요청
    deleteEduCourse($(this).parent().parent());
  });

  // 강의 추가
  btnAddEduCourse.bind('click', function () {
    addCourseGroupItem();
  });

  /**
   * 동적으로 추가된 강의에 이벤트 바인딩
   */
  courseContainer.on('click', '> li', function (e) {
    // API 삭제 요청
    deleteEduCourse($(e.target).parent().parent().parent());
  });

  // 강의를 그룹에 추가한다.
  function addCourseGroupItem () {

      var course_id = selectCourseList.find('option:selected').val();
    var course_name = selectCourseList.find('option:selected').text();
      var course_group_key = $('#course_group_key').val();
      var element = "";

      // 강의 중복추가 방지
      var duplicated_item = $('.list-group-item[data-course-id="' + course_id + '" ]');
      if (duplicated_item.length) {
          duplicated_item.show();
          return false;
      }

      element += '<li class="list-group-item" data-course-id="' + course_id + '" data-course-group-id="" data-course-group-key="' + course_group_key + '">';
      element += '    <div class="course">';
      element += '        <span class="handle ui-sortable-handle">';
      element += '            <i class="fa fa-ellipsis-v"></i>';
      element += '            <i class="fa fa-ellipsis-v"></i>';
      element += '        </span>';                 
      element += course_name;
      element += '        <a href="#" class="btn-delete-course">';
      element += '            <i class="fa fa-remove text-red"></i>';
      element += '        </a>';
      element += '    </div>';
      element += '</li>';

      courseContainer.append(element);

  }

  // 교육과정에서 강의를 삭제한다.
  // @params course : .btn-delete-course 버튼의 부모의 부모 element
  function deleteEduCourse (course) {
    course.hide();
  }

  /**
   * 강의순서를 변경한다.
   */
  // function changeCourseOrder () {
  //   var promises = [];
  //   var items = $('div.list-group-item');

  //   for (var index = 0; index < items.length; index++) {
  //     promises.push(makeCourseOrderChangeRequest($(items[index])));
  //   }

  //   axios.all(promises).then(function (results) {
  //     results.forEach(function (response) {
  //       location.reload();
  //     });
  //   });
  // }

  /**
   * DB 에서 강의 순서를 변경한다.
   */
  function makeCourseOrderChangeRequest (course) {
    return axios({
      method: 'put',
      url: '/education/coursegroup',
      data: {
          id: course.data('course-group-id'),
          order: course.index()
      }
    });       
  }

  // 설정값을 저장하려고 할 때 전체 값을 가져와서 합산이 100이 떨어지지 않을 경우 에러 메시지를 띄운다.
  btnRegisterPointWeight.bind('click', function (e) {

    var pointTotal = calculateTotalWeight();

    if (pointTotal !== 100) {
      alert("포인트의 합계가 100이 되어야 합니다. 설정 값을 다시 확인해 주세요");
      e.preventDefault();
    } else {
      frmPointWeight.submit();
    }
  });

  // 숫자가 입력되지 않았을 경우 경고창을 띄워준다.
  pointWeightForm.find('input').bind('blur', function () {
    validateEveryInput($(this));
    totalPoint.html(calculateTotalWeight());
  });

  // input value 초기화
  pointWeightForm.find('input').each(function (index, elem) {
    if ($(elem).attr('type') !== 'hidden') {
      var _val = $(elem).val();

      if (_val === '') {
        $(elem).val(0);
        pointTotal = 0;
      }
      pointTotal += parseInt($(elem).val());
      totalPoint.html(pointTotal);
    }
  });

  // calculate totalPoint
  pointWeightForm.find('input').bind('keydown', function (e) {
    // block from insert dot character
    if (e.keyCode === 190 || e.keyCode === 13) {
      return false;
    }
    totalPoint.html(calculateTotalWeight());
  });

  // input값을 돌면서 합산을 내는 함수를 별도로 제작한다.
  function calculateTotalWeight () {
    var pointTotal = 0;
    pointWeightForm.find('input').each(function (index, elem) {
      if ($(elem).is(":visible")) {
        pointTotal += parseInt($(elem).val());
      }
    });
    return pointTotal;
  }

  /**
   * 엘리먼트에 설정된 값을 규칙에 맞게 수정을 한다.
   * @param elem
   */
  function validateEveryInput(elem) {
    var _val = elem.val();

    if (_val == 0 && _val.length >= 1) {
      $(elem).val(0);
    }

    if (_val.length >= 3) {
      alert('허용 범위를 넘었습니다.');
      elem.val(0);
    }

    if (_val === '') {
      elem.val(0);
    }

    // 숫자 앞에 0이 있을 경우 앞의 0을 자동으로 제거해준다
    if (_val.split('')[0] === '0') {
      var _tmp = _val.split(''); // 뽑아낸 것을 리턴한다.
      var _len = _tmp.length;

      if (_len >= 2) {
        _val = _val.slice(1, _len);
      }

      elem.val(_val);
    }
  }
});