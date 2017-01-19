

define(function(require) {

    "use strict";

    var jquery_ui = require("jquery_ui");

    // var _self = null;

    /**
     * QuizComponent 생성자
     * @param {object} options - The options object
     * @reference - https://gist.github.com/jonnyreeves/2474026
     */
    function QuizComponent(options, data) {
        
        this.extendOptions(options);
        this.extendData(data);
        this.isNew = (data.quiz_id === null);
        this.init();

        // console.log(this.data);

    }


    /**
     * Prototype
     * 
     */
    QuizComponent.prototype = {
        options: {},
        data: {},
        extend: function (a, b) {
            for(var key in b) { 
                if(b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
            return a;
        },
        // 옵션을 확장한다.
        extendOptions: function (options) {                        
            this.options = this.extend({}, this.options);
            this.extend(this.options, options);
        },     
        // 데이터를 확장한다.
        extendData: function (data) {                        
            this.data = this.extend({}, this.data);
            this.extend(this.data, data);
        },             
        // 퀴즈 데이터를 생성한다.
        setData: function () {
            //console.info('save');

            var question = this.el.querySelector('#question').value,
                answer_desc = this.el.querySelector('#answer_desc'),
                options = this.el.querySelectorAll(".options"),
                correct_options = this.el.querySelectorAll(".correct-checkbox");

            answer_desc = answer_desc ? answer_desc.value : null; 

            if (this.isNew) {
                this.data = {
                    quiz_id: null,
                    type: this.data.type,
                    quiz_type: this.data.quiz_type,
                    question: question,
                    answer_desc: answer_desc,
                    option_group_id: this.data.option_group_id,
                    order: this.options.index,
                    options: [] // 보기
                };
            } else {
                this.data.question = question;
                this.data.answer_desc = answer_desc;
                this.data.order = this.options.index;
                this.data.options = [];
            }

            if (options.length) {
                for (var index = 0; index < options.length; index++) {                    
                    this.data.options.push({
                        id: options[index].dataset.optionId,
                        opt_id: this.data.option_group_id,
                        option: options[index].value,
                        iscorrect: correct_options[index].checked ? 1 : 0,
                        order: index
                    });
                }
            }          
        },           
        init: function () {
            //console.info('initilize');

            this.create_quiz();
            if (this.data.quiz_id) {
                this.el.querySelector('#question').value = this.data.question;

                switch (this.data.quiz_type) {
                    case "A": // 단답형
                        this.el.querySelector('#answer_desc').value = this.data.answer_desc;
                        break;
                    case "B": // 선택형 
                    case "C": // 다답형
                        for (var index = 0; index < this.data.options.length; index++) {                            
                            var data = this.data.options[index];
                            this.create_quiz_options(data);                            
                        }
                        break;                        
                
                    default:
                        break;
                }
            }

            this.create_quiz_events();        
            this.create_option_events();
            this.show();            
        },
        // 퀴즈의 기본 이벤트를 생성한다.
        create_quiz_events: function () {
            //console.info('create_events');

            // 퀴즈 수정모드에서만 사용가능 (deprecated)
            // if (this.data.quiz_id) {
            //     var btn_save = this.el.querySelector('.btn-save-quiz');                
            //     btn_save.addEventListener( "click", function(e) {
            //         e.preventDefault();
            //         // this.save();
            //     }.bind(this));                
            // }

            var btn_remove = this.el.querySelector('.btn-remove-quiz');

            // 퀴즈 삭제
            btn_remove.addEventListener( "click", function(e) {
                e.preventDefault();
                this.remove();
            }.bind(this));    

        },
        // 선택형, 다답형일 경우 이벤트를 생성한다.
        create_option_events: function () {

            if (this.data.quiz_type !== "A") { 
                var btn_add_option = this.el.querySelector('#btn-add-option');
                var input_add_option = this.el.querySelector('#input-add-option');
                var btn_remove_option = this.el.querySelector('.btn_remove_option');
                var option_box = this.el.querySelector('#option-box');

                // 보기 추가 (엔터키 입력시)
                input_add_option.addEventListener("keypress", function(e) {

                    var key = e.which || e.keyCode;
                    
                    if (key === 13 && input_add_option.value) {
                        this.create_quiz_options();                    
                    }
                }.bind(this));

                // 보기 추가 ( + 버튼 클릭시)           
                btn_add_option.addEventListener("click", function(e) {
                    e.preventDefault();

                    if (input_add_option.value)
                        this.create_quiz_options();

                }.bind(this));
            }            
        },
        // 퀴즈를 보여준다.
        show: function () {
            //console.info('show');
            
            this.options.wrapper.appendChild(this.el);
            var input_question = this.el.querySelector('#question');
            input_question.focus();
        },
        // 퀴즈를 DB 에서 삭제한다.
        delete: function () {
            this.options.wrapper.removeChild(this.el);
        },
        // 퀴즈를 삭제한다.
        remove: function () {
            //console.info('remove');
            // console.log(_self);
            this.options.parent.removeQuiz(this);
        },
        // 저장 전 유효성 검사
        validate: function () {
            //console.info('validate');

            // 빈칸여부 확인
            var nodes = this.el.querySelectorAll("input[type=text]:not(#input-add-option)");
            var i, correct_checked = 0; // 정답체크한 보기의 수

            if (this.data.quiz_type !== "A" && nodes.length <= 2) {
                alert("보기를 2개 이상 입력해주세요.");
                return false;
            }

            for (i = 0; i < nodes.length; i++) {
                if (nodes[i].value == "") {
                    alert('빈칸은 모두 입력해주세요.');
                    nodes[i].focus();
                    return false;
                }
            } 

            // 단답형이 아닐 경우에만 정답체크여부 확인
            if (this.data.quiz_type !== "A") {
                
                nodes = this.el.querySelectorAll(".correct-checkbox");        
                for (i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked) {
                        correct_checked++;
                    }
                }

                if (!correct_checked) {
                    alert('정답을 체크해주세요.');
                    return false;
                }
            }

            return true;               
        },
        // 퀴즈를 생성한다.
        create_quiz: function () {
            //console.info('create_element');

            this.el = document.createElement("div");
            this.el.className = "box box-success";

            var innerstr = '';
            // box header
            innerstr += '   <div class="box-header" data-index="' + this.options.index + '">';
            innerstr += '       <i class="fa fa-quora"></i>';
            innerstr += '       <h3 class="box-title">' + (this.options.index + 1) + '번 문제</h3>';
            innerstr += '       <div class="box-tools pull-right" data-toggle="tooltip" title="" data-original-title="Status">';
            innerstr += '           <div class="btn-group" data-toggle="btn-toggle">';
            // if (this.options.quiz_id) {
            // innerstr += '               <button type="sumit" class="btn btn-default btn-sm btn-save-quiz">';
            // innerstr += '                   <i class="fa fa-save">  저장</i>';
            // innerstr += '               </button>';
            // }
            innerstr += '               <button type="button" class="btn btn-default btn-sm btn-remove-quiz" data-widget="remove">';
            innerstr += '                   <i class="fa fa-times">  삭제</i>';
            innerstr += '               </button>';
            innerstr += '           </div>';
            innerstr += '       </div>';
            innerstr += '   </div>';
            
            // A: 단답형, B: 선택형, C: 다답형
            if (this.data.quiz_type === 'A') {
                innerstr += '   <div class="box-body">';
                innerstr += '       <div class="form-group">';
                innerstr += '           <input type="text" class="form-control" name="question" id="question" placeholder="질문을 입력하세요" required autocomplete="off" />';
                innerstr += '       </div>';
                innerstr += '       <div class="form-group">';
                innerstr += '           <input type="text" class="form-control" name="answer_desc" id="answer_desc" placeholder="답변을 입력하세요" required autocomplete="off" />';
                innerstr += '       </div>';
                innerstr += '   </div>';                    
            } else {
                innerstr += '   <div class="box-body">';
                innerstr += '       <div class="form-group">';
                innerstr += '           <input type="text" class="form-control" name="question" id="question" placeholder="질문을 입력하세요" required autocomplete="off" />';
                innerstr += '       </div>';
                innerstr += '       <div id="option-box">';
                innerstr += '       </div>';
                innerstr += '   </div>';

                innerstr += '   <div class="box-footer clearfix">';
                innerstr += '       <div class="input-group">';
                innerstr += '           <input id="input-add-option" class="form-control" placeholder="추가할 보기 내용을 입력하세요">';
                innerstr += '           <div class="input-group-btn">';
                innerstr += '               <button id="btn-add-option" type="button" class="btn btn-default"><i class="fa fa-plus"></i></button>';
                innerstr += '           </div>';
                innerstr += '       </div>';
                innerstr += '   </div>';        
            }
            
            // create html
            this.el.innerHTML = innerstr;          

        },
        // 퀴즈의 보기를 생성한다.
        create_quiz_options: function (data) {
            //console.info('create_element_options');
            // console.log(data);

            var option_box = this.el.querySelector('#option-box');
            var item = document.createElement("div");
            var input_add_option = this.el.querySelector('#input-add-option');
            var _self = this;

            item.className = "item";

            if (data)
                item.setAttribute("data-option-id", data.id);

            item.onclick = function (e) {
                if (e.target.classList[2] == "btn-remove-option") {
                    if (data) {
                        var option_id = $(e.target).closest(".item").data('option-id');
                        _self.options.parent.deleteQuizOption(option_id, function () {
                            this.parentNode.removeChild(this);
                        }.bind(this));
                    } else {
                        this.parentNode.removeChild(this);
                    }
                } 
            };

            var innerstr = '';
            innerstr += '<div class="form-group">';
            innerstr += '   <div class="input-group">';
            innerstr += '       <span class="input-group-addon">';

            // B: 선택형, C: 다답형
            if (data) {
                if (this.data.quiz_type === 'B')
                    innerstr += '           <input name="radio-group-' + this.options.index  + '" class="correct-checkbox" type="radio" ' + (data.iscorrect === 1 ? 'checked' : '') + ' />';
                else
                    innerstr += '           <input type="checkbox" class="correct-checkbox" ' + (data.iscorrect === 1 ? 'checked' : '') + ' />';
                innerstr += '       </span>';
                innerstr += '       <div class="input-group" style="width: 100%">';
                innerstr += '           <input type="text" class="form-control options" required autocomplete="off" placeholder="보기를 입력하세요" data-option-id="' + data.id + '" value="' + data.option + '" />';                              
            } else {
                if (this.data.quiz_type === 'B')
                    innerstr += '           <input name="radio-group-' + this.options.index  + '" class="correct-checkbox" type="radio" />';
                else
                    innerstr += '           <input type="checkbox" class="correct-checkbox" />';                
                innerstr += '       </span>';
                innerstr += '       <div class="input-group" style="width: 100%">';
                innerstr += '           <input type="text" class="form-control options" required autocomplete="off" placeholder="보기를 입력하세요" value="' + input_add_option.value + '" />';                
            }

            innerstr += '           <div class="input-group-btn btn-remove-option">';
            innerstr += '               <button id="btn-remove-option" type="button" class="btn btn-danger btn-remove-option"><i class="fa fa-minus btn-remove-option"></i></button>';
            innerstr += '           </div>';
            innerstr += '       </div>';           
            innerstr += '    </div>';
            innerstr += '</div>';

            item.innerHTML = innerstr;
            option_box.appendChild(item);
            
            input_add_option.value = "";
        },
        // 인덱스를 변경한다. 
        setIndex: function (new_index) {
            this.options.index = new_index;
            var header = this.el.querySelector('.box-header');
            var title = this.el.querySelector('.box-title');
            header.setAttribute('data-index', new_index + 1);
            title.innerHTML = (new_index + 1) + '번 문제';
        },            
    };

    return QuizComponent;
    
});