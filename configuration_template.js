const configuration_template = {
  secret_token: 'by-ovaphlow',
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
  weixin: {
    appid: 'wxbf9bb377ed519ed8',
    secret: '9b6e8dbfcb137b42be93a0c91a19622f',
  },
};

module.exports = configuration_template;
