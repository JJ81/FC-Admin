const unirest = require('unirest');

exports.sendMessage = (subject, phones, msg, callback) => {
  unirest.post('http://api.apistore.co.kr/ppurio/1/message/sms/udt4455')
    .header({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-waple-authorization': 'NTgyNy0xNDkwNTk2MjYzNDg1LTExN2FiMjQ5LTJiOGQtNGRiOS1iYWIyLTQ5MmI4ZDlkYjk5YQ=='
    })
    .send({
      'send_phone': '07088450500',
      'dest_phone': phones,
      'subject': subject,
      'msg_body': msg
    })
    .end((response) => {
      callback(response.body);
    }
  );
};

/**
  발신번호 등록
 */
exports.registSendNumber = (phone, callback) => {
  unirest.post('http://api.apistore.co.kr/ppurio/1/sendnumber/save/udt4455')
    .header({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-waple-authorization': 'NTgyNy0xNDkwNTk2MjYzNDg1LTExN2FiMjQ5LTJiOGQtNGRiOS1iYWIyLTQ5MmI4ZDlkYjk5YQ=='
    })
    .send({
      'sendnumber': phone,
      'comment': '오렌지나무시스템 대표번호'
    })
    .end((response) => {
      callback(response.body);
    }
  );
};

