const os = require('os');

const configuration_template = {
  secret_token: '',
  persistence: {
    host: '127.0.0.1:3306',
    database: '',
    user: 'root',
    password: '',
  },
  grpc_service: '127.0.0.1:50051',
  email: {
    service: 'qq',
    auth: {
      user: 'longzhaopin@foxmail.com',
      pass: 'djtkwgcgtbknjhbh',
    },
  },
  wx: {
    appid: 'wx79586a354703320a',
    appSecret: '53b1e116cfb28e1626d1c76ea484b05b',
    getTokenApi: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&',
    getTicketApi:
      'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=TOKEN&type=jsapi',
  },
};

module.exports = configuration_template;
