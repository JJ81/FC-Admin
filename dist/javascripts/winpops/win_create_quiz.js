"use strict";requirejs(["common","quiz_service"],function(i){function e(){return axios.get("/api/v1/course/group/id/create")}function t(){var i=$("input[name=course_id]").val();return axios.get("/course/sessioncount",{params:{id:i}})}var n=require("quiz_service");$.widget.bridge("uibutton",$.ui.button);var o=$("#btn-add-quiz-a"),a=$("#btn-add-quiz-b"),r=$("#btn-add-quiz-c"),u=$("#regist-quiz"),d=$("#createQuiz"),c=document.getElementById("quiz-container");$(function(){axios.all([e(),t()]).then(axios.spread(function(i,e){var t={root_wrapper:d,wrapper:c},o={course_id:$("input[name=course_id]").val(),course_list_id:null,quiz_group_id:i.data.id,quiz_list:null,type:d.data("type"),title:$("#title").val(),session_count:e.data.session_count};n=new n(t,o,function(i){alert("퀴즈를 등록하였습니다."),window.parent.opener.location.reload(),window.close()})}))}),$(".connectedSortable").sortable({placeholder:"sort-highlight",connectWith:".connectedSortable",handle:".box-header",forcePlaceholderSize:!0,zIndex:999999,start:function(i,e){$(this).attr("data-previndex",e.item.index())},update:function(i,e){var t=e.item.index(),o=$(this).attr("data-previndex");$(this).removeAttr("data-previndex"),n.moveQuizIndexes(o,t)}}),o.bind("click",function(){n.addQuizSingleAnswer()}),a.bind("click",function(){n.addQuizMultiOptionWithOneAnswer()}),r.bind("click",function(){n.addQuizMultiOptionWithMultiAnswer()}),u.bind("click",function(){n.saveSessionAndQuiz()})});