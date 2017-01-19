
var QuizComponent = (function ( $, window ) {

  'use strict';

    /**
     * Extend obj function
     *
     * This is an object extender function. It allows us to extend an object
     * by passing in additional variables and overwriting the defaults.
     */
    function extend(a, b) {
        for(var key in b) { 
            if(b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * QuizComponent constructor
     * @param {object} options - The options object
     */
    function QuizComponent(options) {   
        
        // 퀴즈 정보를 설정한다.
        this.options = extend({}, this.options);
        extend(this.options, options);

        console.log(this.options);

        this._init();
    }

    /**
     * 퀴즈에 대한 정보를 담고 있다
     */
    QuizComponent.prototype.options = {};

    /**
     * 퀴즈를 추가한다.
     */
    QuizComponent.prototype._element = function () {

        this.el = document.createElement("div");
        this.el.className = "box box-success";
        // this.el.style.cssText = "position: relative; left: 0px; top: 0px;";

        var innerstr = '';
        // box header
        innerstr += '   <div class="box-header">';
        innerstr += '       <i class="fa fa-quora"></i>';
        innerstr += '       <h3 class="box-title">' + (this.options.group_order + 1) + ') ' + this.options.display_name + '</h3>';
        innerstr += '       <div class="box-tools pull-right" data-toggle="tooltip" title="" data-original-title="Status">';
        innerstr += '           <div class="btn-group" data-toggle="btn-toggle">';
        innerstr += '               <button type="sumit" class="btn btn-default btn-sm btn-save-quiz">';
        innerstr += '                   <i class="fa fa-save">  저장</i>';
        innerstr += '               </button>';
        innerstr += '               <button type="button" class="btn btn-default btn-sm btn-remove-quiz" data-widget="remove">';
        innerstr += '                   <i class="fa fa-times">  삭제</i>';
        innerstr += '               </button>';
        innerstr += '           </div>';
        innerstr += '       </div>';
        innerstr += '   </div>';
        // box body
        if (this.options.display_type === 'A') {
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

    };

    /**
     * 보기를 제거한다.
     */
    QuizComponent.prototype._element_options = function() {

        var option_box = this.el.querySelector('#option-box');
        var item = document.createElement("div");
        var input_add_option = this.el.querySelector('#input-add-option');

        item.className = "item";
        item.onclick = function (e) {
            if (e.target.classList[2] == "btn-remove-option")
                this.parentNode.removeChild(this); 
        };

        var innerstr = '';
        innerstr += '    <div class="form-group">';
        innerstr += '        <div class="input-group">';
        innerstr += '            <span class="input-group-addon">';
        if (this.options.display_type === 'B') // 선택형            
        innerstr += '                <input name="radio-group" class="correct-checkbox" type="radio" />';
        else
        innerstr += '                <input type="checkbox" class="correct-checkbox" />';
        innerstr += '            </span>';
        innerstr += '           <div class="input-group" style="width: 100%">';
        innerstr += '               <input type="text" class="form-control options" required autocomplete="off" placeholder="보기를 입력하세요" value="' + input_add_option.value + '" />';
        innerstr += '               <div class="input-group-btn btn-remove-option">';
        innerstr += '                   <button id="btn-add-option" type="button" class="btn btn-danger btn-remove-option"><i class="fa fa-minus btn-remove-option"></i></button>';
        innerstr += '               </div>';
        innerstr += '           </div>';       
        
        innerstr += '        </div>';
        innerstr += '    </div>';

        item.innerHTML = innerstr;
        option_box.appendChild(item);
        
        input_add_option.value = "";
    };

    /**
     * Initialise the QuizComponent
     * TODO
     * hbs 파일을 주입하는 형태 알아볼 것 (서버로 요청 시 전체 layout 을 다시렌더하여 반환한다.)
     * template id 와 연동되는 부분 확인해볼 것(2017.01.12)
     */
    QuizComponent.prototype._init = function() {

        this._element();        
        this.show();
        this._events();
                
    };    

    /**
     * QuizComponent _events
     *
     * This is our events function, and its sole purpose is to listen for
     * any events inside our QuizComponent.
     *
     * @type {HTMLElement} btn_dismiss - The dismiss-alert button
     */
    QuizComponent.prototype._events = function() {
    
        // cache vars
        var btn_save = this.el.querySelector('.btn-save-quiz'),
            btn_remove = this.el.querySelector('.btn-remove-quiz'),
            self = this;

        // listen for btn_save
        btn_save.addEventListener( "click", function(e) {
            e.preventDefault();
            self.save();
        });

        // listen for btn_remove
        btn_remove.addEventListener( "click", function(e) {
            e.preventDefault();
            self._remove();
        });                

        // 선택형, 다답형
        if (this.options.display_type !== "A") { 
            var btn_add_option = this.el.querySelector('#btn-add-option');
            var input_add_option = this.el.querySelector('#input-add-option');
            var btn_remove_option = this.el.querySelector('.btn_remove_option');
            var option_box = this.el.querySelector('#option-box');

            // 보기 추가 (엔터키 입력시)
            input_add_option.addEventListener("keypress", function(e) {

                var key = e.which || e.keyCode;
                
                if (key === 13 && input_add_option.value) {
                    this._element_options();                    
                }
            }.bind(this));

            // 보기 추가 ( + 버튼 클릭시)           
            btn_add_option.addEventListener("click", function(e) {
                e.preventDefault();

                if (input_add_option.value)
                    this._element_options(); 
            }.bind(this));
        }

    }; 

    /**
     * QuizComponent show
     *
     * This function simply shows our QuizComponent by appending it
     * to the wrapper.
     */
    QuizComponent.prototype.show = function() {

        this.options.wrapper.appendChild(this.el);

        var input_question = this.el.querySelector('#question');
        input_question.focus();

    };    
    

    /**
     * 퀴즈를 DB 에 저장한다.
     */
    QuizComponent.prototype.save = function() {

        // var _btn_save = this.el.querySelector('.btn-save-quiz');
        // if (this._hasClass(_btn_save, 'disabled'))
        //     return false;

        if (this._validate()) {
            
            var question = this.el.querySelector('#question').value,
                answer_desc = this.el.querySelector('#answer_desc'),
                options = this.el.querySelectorAll(".options"),
                correct_options = this.el.querySelectorAll(".correct-checkbox"); 

            answer_desc = answer_desc ? answer_desc.value : null; 
            
            var quiz = {
                course_id: this.options.course_id,
                course_list_id: this.options.course_list_id,
                type: this.options.type,
                question: question,
                answer_desc: answer_desc,
                group_id: this.options.group_id,
                group_title: this.options.group_title,
                group_order: this.options.group_order,
                option_id: this.options.option_group_id,
                options: [] // 보기
            };

            if (options.length) {
                for (var i = 0; i < options.length; i++) {
                    quiz.options.push([
                        this.options.option_group_id,
                        options[i].value,
                        correct_options[i].checked,
                        i
                    ]);                          
                    // quiz.options.push({
                    //     opt_id: this.options.option_group_id,
                    //     option: options[i].value,
                    //     iscorrect: correct_options[i].checked,
                    //     order: i
                    // });            
                }
            }   

            // console.log(quiz);
            // return false;

            // 데이터 전송
            $.ajax({   
                type: "POST",
                url: "/course/create/quiz",
                data: { quiz: quiz }
            }).done(function (res) {                   
                if (!res.success) {
                    console.error(res.msg);
                } else {
                    alert('퀴즈를 저장하였습니다.');

                    // 퀴즈 아이디를 저장한다.
                    this.options.quiz_id = res.quiz_id;
                    console.log(res.quiz_id);
                }
            }.bind(this));
        }
        
    }; 

    /**
     * QuizComponent 를 삭제한다.
     */
    QuizComponent.prototype._remove = function() {

        if (!confirm("삭제하시겠습니까?"))
            return false;
    
        if (this.options.quiz_id) {
            $.ajax({
                url: '/course/quiz',
                data: { quiz_id: this.options.quiz_id },
                type: 'DELETE',
                }).done(function (res) { 
                    if (!res.success) {
                        console.error(res.msg);
                    } else {
                        alert('퀴즈를 삭제하였습니다.');
                        this.options.wrapper.removeChild(this.el);
                    }
                }.bind(this));
        } else {
            this.options.wrapper.removeChild(this.el);
        }

    };

    /**
     * QuizComponent form validation
     */    
    QuizComponent.prototype._validate = function() {
        
        // 빈칸여부 확인
        var nodes = this.el.querySelectorAll("input[type=text]:not(#input-add-option)");
        var i, correct_checked = 0; // 정답체크한 보기의 수

        if (this.options.display_type !== "A" && nodes.length <= 2) {
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
        if (this.options.display_type !== "A") {
            
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
    }; 

    /**
     * element 에 특정 className 이 있는지 체크한다.
     */
    QuizComponent.prototype._hasClass = function(elem, cls) {
        return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
    };    

    return QuizComponent;

})( jQuery, window );