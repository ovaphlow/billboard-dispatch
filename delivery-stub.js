const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const proto = grpc.loadPackageDefinition(
  // eslint-disable-next-line
  protoLoader.loadSync(`${__dirname}/delivery.proto`, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }),
).delivery;

module.exports = proto;
