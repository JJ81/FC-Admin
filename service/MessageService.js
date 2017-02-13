//POST
var request = require('request');
var Iconv = require('iconv').Iconv;
const queryString = require('query-string');
var MessageService = {};
 
// 헤더 부분
var headers = {
    'Content-Type':     'application/x-www-form-urlencoded; charset=euc-kr'
};
 
// 요청 세부 내용
var options = {
    url: 'http://biz.xonda.net/biz/biz_newV2/SMSASP_WEBV4_s.asp',
    method:'POST',
    headers: headers,
    form: {
        biz_id: "molla4455",
        smskey: "9407AC67-074A-4F0F-9104-53A4AA053F9B",
        send_number: "01020091407",
        receive_number: "01020091407",
        return_url: "http://admin-clipplr.orangenamu.net/api/v1/sms/callback",
        sms_contents: "교육과정이 배정되었습니다."             
    }
};
 
MessageService.send = function ( _msg, _callback ) {
    
    console.log('message sending..');

    var headers = { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr'
        },
        options = {
            biz_id: "molla4455",
            smskey: "9407AC67-074A-4F0F-9104-53A4AA053F9B",
            send_number: "01020091407",
            receive_number: "01020091407",
            return_url: "http://admin-clipplr.orangenamu.net/api/v1/sms/callback",
            sms_contents: _msg
        };
    
    // var iconv = new Iconv('UTF-8', 'EUC-KR');
    // var encoded_str = iconv.convert(queryString.stringify(options));
    
    var encoded_str = queryString.stringify(options);
    // console.log(encoded_str);

    request(
        {
            url: 'http://biz.xonda.net/biz/biz_newV2/SMSASP_WEBV4_s.asp', //URL to hit
            headers: headers,
            method: 'POST',
            encoding: null,
            body: encoded_str
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
                var data = new Buffer(body, 'binary');
                var data_utf8 = euckr2utf8.convert(data).toString();

                console.log(data_utf8);
                _callback(error, null);
            }
        });

};

module.exports = MessageService;