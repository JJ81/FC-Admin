
/**
 * @reference: https://gist.github.com/jonnyreeves/2474026
 */
define(function(require) {

    "use strict";

    require('es6-promise').polyfill(); // https://github.com/stefanpenner/es6-promise 참고

    var QuizComponent = require('quiz_component');
    var axios = require('axios');
    var _self = null;

    /**
     * QuizService 생성자
     */
    function QuizService (options, data, callback) {

        // 옵션을 설정한다.
        _self = this;

        _self.extendOptions(options);
        _self.extendData(data);
        _self.isNew = (data.course_list_id === null);
        _self.callback = callback;
        _self.setOptions(options);
        _self.init();
    }

    QuizService.prototype = {

        // 퀴즈 서비스에 대한 옵션 정보를 담고 있다
        options: {},
        // course_list 데이터
        data: {},
        // QuizComponent 리스트
        quiz_list: [],        
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
        init: function () {
            // 데이터가 있을 경우 QuizComponent 를 생성한다.
            if (_self.data.quiz_list) {
                for (var index = 0; index < _self.data.quiz_list.length; index++) {
                    var data = _self.data.quiz_list[index];
                    
                    switch (data.quiz_type) {
                        case "A": 
                            _self.addQuizSingleAnswer(data);
                            break;

                        case "B":                            
                            _self.addQuizMultiOptionWithOneAnswer(data);
                            break;

                        case "C":
                            _self.addQuizMultiOptionWithMultiAnswer(data);                            
                            break;                                                    
                    
                        default:
                            break;
                    }
                }

                // console.log(_self.quiz_list);
            }
        },
        // 옵션을 확장한다.
        setOptions: function (options) {
            function extend(a, b) {
                for(var key in b) { 
                    if(b.hasOwnProperty(key)) {
                        a[key] = b[key];
                    }
                }
                return a;
            }
            
            _self.options = extend({}, _self.options);
            extend(_self.options, options);
        },  
        // 랜덤 문자열을 생성한다.
        // api 명에 특정 문자열이 포함될 경우 (예: create, string ..) 동작하지 않을 수 있다.
        getRandomString: function () {         
            return axios.get('/api/v1/randomkey');
        },
        // 단답형 퀴즈를 생성한다.
        addQuizSingleAnswer: function (data) {
            
            var options = {                
                wrapper: _self.options.wrapper,
                parent: _self,
                index: data ? data.order : _self.quiz_list.length
            };

            if (!data) {
                data = {
                    quiz_id: null,
                    type: _self.data.type,
                    quiz_type: "A",
                    quiz_type_name: "단답형"
                };
            }

            var obj = new QuizComponent(options, data);
            _self.quiz_list.push(obj);
        },
        // 선택형 퀴즈를 생성한다.
        addQuizMultiOptionWithOneAnswer: function (data) {

            var options = {
                    wrapper: _self.options.wrapper,
                    parent: _self,
                    index: data ? data.order : _self.quiz_list.length
                },
                obj = null;      

            if (data) {
                obj = new QuizComponent(options, data);
                _self.quiz_list.push(obj);
            } else {
                // axios.all([
                //     _self.getRandomString()
                // ])
                // .then(axios.spread(function (res) {
                    data = {
                        quiz_id: null,
                        type: _self.data.type,
                        quiz_type: "B",
                        quiz_type_name: "선택형",
                        option_group_id: _self.createGUID()
                    };
                    console.log(data);
                    obj = new QuizComponent(options, data);  
                    _self.quiz_list.push(obj);
                // }));   
            }

        },
        // 다답형 퀴즈를 생성한다.
        addQuizMultiOptionWithMultiAnswer: function (data) {

            var options = {
                    wrapper: _self.options.wrapper,                
                    parent: _self,
                    index: data ? data.order : _self.quiz_list.length
                },
                obj = null;

            if (data) {
                options.index = data.order;
                obj = new QuizComponent(options, data);
                _self.quiz_list.push(obj);
            } else {
                // axios.all([
                //     _self.getRandomString()
                // ])
                // .then(axios.spread(function (res) {
                    data = {
                        quiz_id: null,
                        type: _self.data.type,
                        quiz_type: "C",
                        quiz_type_name: "다답형",
                        option_group_id: _self.createGUID() //res.data.id
                    };
                    console.log(data);
                    obj = new QuizComponent(options, data);
                    _self.quiz_list.push(obj);
                // }));                
            }             
        },
        // 퀴즈를 삭제한다.
        removeQuiz: function (quiz) {
            if (!confirm("삭제하시겠습니까?"))
                return false;            
            
            if (quiz.isNew) {
                quiz.delete();
                _self.quiz_list.splice(quiz.options.index, 1);
                _self.updateQuizIndexes();                
            } else {
                _self.deleteQuiz(quiz);
            }        
        },
        // DB에서 퀴즈를 삭제한다.
        deleteQuiz: function (quiz) {
            axios.delete('/course/quiz', {
                params: {
                    quiz_id: quiz.data.quiz_id,
                    option_group_id: quiz.data.option_group_id
                }
            })
            .then(function (response) {
                alert("퀴즈를 삭제하였습니다.");
                quiz.delete();
                _self.quiz_list.splice(quiz.options.index, 1);
                _self.updateQuizIndexes();
            })
            .catch(function (error) {
                console.log(error);
            });            
        },
        // DB에서 퀴즈 보기를 삭제한다.
        deleteQuizOption: function (option_id, callback) {
            
            axios.delete('/course/quiz/option', {
                params: {
                    option_id: option_id
                }
            })
            .then(function (response) {
                alert('보기를 삭제하였습니다.');
                callback();
            })
            .catch(function (error) {
                console.log(error);
            });
        },        
        // 퀴즈를 저장하기 전 유효성 검사
        validateQuiz: function () {
            var isValid = true;
            for (var index = 0; index < _self.quiz_list.length; index++) {
                var quiz = _self.quiz_list[index];
                if (!quiz.validate()) {
                    isValid = false;
                    break;
                }                                    
            }

            return isValid;
        },
        // 세션을 생성/수정 한다.
        saveSession: function () {

            console.log('saveSession');
            var title = _self.options.root_wrapper.find('#title').val();
            if (_self.isNew) {
                return axios({
                    method: 'post',
                    url: '/course/quiz/courselist',
                    data: {
                        course_list_id: null,
                        course_id: _self.data.course_id,
                        title: title,
                        type: _self.data.type,
                        order: _self.data.session_count + 1,
                        quiz_group_id: _self.data.quiz_group_id            
                    }
                });
            } else {
                return axios({
                    method: 'put',
                    url: '/course/courselist',
                    data: {
                        course_list_id: _self.data.course_list_id,                        
                        course_list_order: _self.data.course_list_order,
                        title: title
                    }
                });
            }

        },
        // 퀴즈를 생성/수정 한다.
        saveQuiz: function (quiz) {
            // 저장할 데이터를 셋팅한다.
            quiz.setData();

            if (quiz.isNew) {
                // 입력
                return axios({
                    method: 'post',
                    url: '/course/quiz',
                    data: {
                        quiz_group_id: _self.data.quiz_group_id,
                        quiz: quiz.data
                    }
                });
            } else {
                // 수정
                return axios({
                    method: 'put',
                    url: '/course/quiz',
                    data: {
                        quiz_group_id: _self.data.quiz_group_id,
                        quiz: quiz.data
                    }
                });
            }
        },
        // 세션과 퀴즈를 일괄 저장한다.
        saveSessionAndQuiz: function () {
            
            if (!_self.quiz_list.length) {
                alert('등록된 퀴즈가 없습니다. 퀴즈 유형을 먼저 선택하세요.');
                return false;
            }

            if (!_self.validateQuiz())
                return false;
            
            if (!confirm("자료를 저장하시겠습니까?"))
                return false;
            
            // 세션을 저장한다.
            axios.all([ _self.saveSession() ])
                .then(axios.spread(function (res) {
                    
                    // 각각의 퀴즈를 저장한다.
                    var promises = [];
                    _self.quiz_list.forEach(function(quiz){
                        promises.push(_self.saveQuiz(quiz));
                    });

                    // 저장 성공 시 윈도우 팝업을 종료한다
                    axios.all(promises).then(function(results) {
                        results.forEach(function(response) {
                            console.log(response.data);
                        });
                        _self.callback('success');
                    });

                }));
            
        },
        // 퀴즈의 순서를 재작성한다.
        updateQuizIndexes: function () {
            var arr = _self.quiz_list;
            for (var index = 0; index < arr.length; index++) {
                arr[index].setIndex(index);
            }            
            // console.info(_self.quiz_list);
        },
        // 퀴즈의 순서를 변경한다.
        moveQuizIndexes: function (oldIndex, newIndex) {
            var arr = _self.quiz_list;
            arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
            _self.updateQuizIndexes();
        },
        // guid 를 생성한다. (용도: 보기그룹아이디)
        createGUID: function () {
            function s4() {
                return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    };    

    return QuizService;
    
});
