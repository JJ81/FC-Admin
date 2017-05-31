const unirest = require('unirest');

exports.sendMessage = (phone, msg, callback) => {
  unirest.post('http://api.apistore.co.kr/ppurio/1/message/sms/udt4455')
    .header({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-waple-authorization': 'NTgyNy0xNDkwNTk2MjYzNDg1LTExN2FiMjQ5LTJiOGQtNGRiOS1iYWIyLTQ5MmI4ZDlkYjk5YQ=='
    })
    .send({
      'send_time': '',
      'dest_phone': phone,
      'dest_name': '홍길동',
      'send_phone': '07088450500',
      'send_name': '홍길순',
      'subject': '제목',
      'msg_body': '내용'
    })
    // .field('send_time', '')
    // .field('dest_phone', phone)
    // .field('dest_name', '홍길동')
    // .field('send_phone', '01033334444')
    // .field('send_name', '홍길순')
    // .field('subject', '제목')
    // .field('msg_body', msg)
    // .field('apiVersion', '1')
    // .field('id', '')
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

