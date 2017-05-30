const unirest = require('unirest');

exports.sendMessage = (phone, msg, callback) => {
  unirest.post('http://mockbin.com/request')
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({ 'parameter': 23, 'foo': 'bar' })
    .end(function (response) {
      console.log(response.body);
    }
  );
};
