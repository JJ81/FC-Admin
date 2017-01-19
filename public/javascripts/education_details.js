/**
 * Created by yijaejun on 30/11/2016.
 */
'use strict';
requirejs([
		'jquery',
        'axios',
        'jquery_ui'
	],
	function ($, axios) {
		// avoid to confliction between jquery tooltip and bootstrap tooltip
		$.widget.bridge('uibutton', $.ui.button);

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

        });

        /**
         * 강의순서를 변경한다.
         */
        function changeCourseOrder () {
            
            var promises = [];
            var items = $('.list-group-item'); //.children().children('a');
            
            for (var index = 0; index < items.length; index++) {
                promises.push(makeCourseOrderChangeRequest($(items[index])));
            }

            axios.all(promises).then(function(results) {
                results.forEach(function(response) {
                    // console.log(response);
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

	}); // end of func