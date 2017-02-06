/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs([
		'jquery',
        'axios',
        'moment',
        'jquery_ui',
        'bootstrap',
        'bootstrap_datetimepicker',
        'adminLTE',
	],
	function ($, axios, moment) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);

        var _btn_modify_edu = $('.btn-modify-edu'), // 교육과정 수정버튼
            _btn_add_course_edu = $('#btn-add-course-edu'), //강의추가 버튼
            _select_course_list = $('#select-course-list'), // 추가할 강의 리스트
            _course_container = $('#draggablePanelList'); // 추가된 강의 목록
        
        // 포인트 가중치 설정 관련 변수
		var _total = 0,
			frm_point_weight = $('#frm_point_weight'),
			pointWeightForm = $('#pointWeight'),
			eduComplete = $('.eduComplete'),
			quizComplete = $('.quizComplete'),
			finalComplete = $('.finalComplete'),
			reeltimeComplete = $('.reeltimeComplete'),
			speedComplete = $('.speedComplete'),
			repsComplete = $('.repsComplete'),
			totalPoint = $('.total_point'),
			btnRegisterPointWeight = $('.btn-register-point-weight');         

        $(function () {

            // jQuery UI sortable 초기화
            $('.list-group').sortable({
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
                    // console.log('newIndex : ' + newIndex + ' oldIndex : ' + oldIndex);                    
                    changeCourseOrder();
                }
            });

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

        });

        // 교육과정 수정
        _btn_modify_edu.bind('click', function () {

            var button = $(this);
            var modal = $('#frm_modify_edu');
            var edu_name = $('.course-name');
            var edu_desc = $('.course-desc');                        
            var course_group_list = makeCourseGroupList();

			if (edu_name.val() === ''){
				alert('교육과정명을 입력하세요.');
				edu_name.focus();
				return false;
			}

			if (edu_desc.val() === ''){
				alert('교육과정 소개를 입력해주세요.');
				edu_desc.focus();
				return false;
			}

            if (!course_group_list.valid_course_count) {
                alert('강의를 추가해주세요.');
                return false;
            }

            if (!confirm("수정하시겠습니까?"))
                return false;

            // 저장한다.
			axios({
				method : 'put',
				url: '/education/modify/edu',
				data : {
                    id: $('#edu_id').val(),
					name : edu_name.val().trim(),
					desc : edu_desc.val().trim(),
					course_group_list : course_group_list.data,
                    start_dt: $('#start_dt').find("input").val() + ' ' + '00:00:00',
                    end_dt: $('#end_dt').find("input").val() + ' ' + '23:59:59'
				}
			}).then(function (res){
				if(res.data.success == true){
					alert('교육과정을 수정하였습니다.');
				}else{
					alert('알 수 없는 오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
				}

				window.location.reload();
			});
        });

        // 강의그룹 데이터를 생성한다.
        function makeCourseGroupList () {

            var course_group_list = [];
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
                    if ($(this).is(":visible")) 
                        course_group.mode = "UPDATE";
                    else
                        course_group.mode = "DELETE";
                else
                    course_group.mode = "INSERT";
                
                course_group_list.push(course_group);

                if (course_group.mode !== "DELETE") {
                    valid_course_count += 1;
                    order += 1;
                }

            });

            return { data: course_group_list, valid_course_count: valid_course_count };
            
        }

        // 강의 삭제
        $('.btn-delete-course').bind('click', function () {
            // API 삭제 요청
            deleteEduCourse($(this).parent().parent());
        });

        // 강의 추가
        _btn_add_course_edu.bind('click', function () {        
            addCourseGroupItem();
        });

        /**
         * 동적으로 추가된 강의에 이벤트 바인딩
         */
        _course_container.on('click', '> li', function (e) {
            // API 삭제 요청
            deleteEduCourse($(e.target).parent().parent().parent());
        });

        // 강의를 그룹에 추가한다.
        function addCourseGroupItem () {

            var course_id = _select_course_list.find('option:selected').val();
			var course_name = _select_course_list.find('option:selected').text();
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

            _course_container.append(element);

        }

        // 교육과정에서 강의를 삭제한다.
        // @params course : .btn-delete-course 버튼의 부모의 부모 element
        function deleteEduCourse (course) {

            // console.log(course);
            course.hide();

            // if (!confirm("강의를 제외하시겠습니까?"))
            //     return false;

            // axios.delete('/education/course', {
            //     params: {
            //         course_group_id: course.data('course-group-id')
            //     }
            // })
            // .then(function (response) {
            //     alert("강의를 삭제하였습니다.");
            //     course.remove();
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });            
        }

        /**
         * 강의순서를 변경한다.
         */
        function changeCourseOrder () {
            
            var promises = [];
            var items = $('div.list-group-item'); //.children().children('a');
            
            for (var index = 0; index < items.length; index++) {
                promises.push(makeCourseOrderChangeRequest($(items[index])));
            }

            axios.all(promises).then(function(results) {
                results.forEach(function(response) {
                    // console.log(response);
                    location.reload();
                });
            });
        }        

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
		btnRegisterPointWeight.bind('click', function (e){
			
			var _total = calculateTotalWeight();
			
			if(_total !== 100){
				alert("포인트의 합계가 100이 되어야 합니다. 설정 값을 다시 확인해 주세요");
                e.preventDefault();
			} else {
                frm_point_weight.submit();
            }
			
		});

		// 숫자가 입력되지 않았을 경우 경고창을 띄워준다.
		pointWeightForm.find('input').bind('blur', function () {
			var _val = $(this).val();
			validateEveryInput($(this));
			totalPoint.html(calculateTotalWeight());
		});

		// input value 초기화
		pointWeightForm.find('input').each(function (index, elem){

            if ($(elem).attr('type') !== 'hidden') {
                var _val = $(elem).val();

                if(_val === ''){
                    $(elem).val(0);
                    _total = 0;
                }
                _total += parseInt($(elem).val());
                totalPoint.html(_total);
            } 
            
		});

		// calculate totalPoint
		pointWeightForm.find('input').bind('keydown', function (e) {
			// block from insert dot character
			if(e.keyCode === 190 || e.keyCode === 13){
				return false;
			}

			totalPoint.html(calculateTotalWeight());
		});

		// input값을 돌면서 합산을 내는 함수를 별도로 제작한다.
		function calculateTotalWeight(){
			var _total = 0;
			pointWeightForm.find('input').each(function (index, elem){
                // console.log(elem);
                if ($(elem).is(":visible")) 
				    _total += parseInt($(elem).val());
			});
			return _total;
		}

		/**
		 * 엘리먼트에 설정된 값을 규칙에 맞게 수정을 한다.
		 * @param elem
		 */
		function validateEveryInput(elem){
			var _val = elem.val();

			// console.log('validation : ' + _val);

			if(_val == 0 && _val.length >= 1){
				// console.log('check zero');
				$(elem).val(0);
			}

			if(_val.length >= 3){
				alert('허용 범위를 넘었습니다.');
				elem.val(0);
			}

			if(_val === ''){
				elem.val(0);
			}

			// 숫자 앞에 0이 있을 경우 앞의 0을 자동으로 제거해준다
			if(_val.split('')[0] === '0'){
				var _tmp = _val.split(''); // 뽑아낸 것을 리턴한다.
				var _len = _tmp.length;

				if(_len >= 2){
					_val = _val.slice(1, _len);
				}

				elem.val(_val);
			}
		}     

	}); // end of func