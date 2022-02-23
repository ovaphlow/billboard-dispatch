const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

// eslint-disable-next-line
const packageDefinition = protoLoader.loadSync(
  `${__dirname}/commonData.proto`,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);
const proto = grpc.loadPackageDefinition(packageDefinition).commonData;

module.exports = proto;
