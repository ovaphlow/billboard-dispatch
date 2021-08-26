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
    secret: '042dd07bb366dcdab45b03cfb0824fc0',
  },
};

module.exports = configuration_template;
