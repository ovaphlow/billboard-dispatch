const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const proto = grpc.loadPackageDefinition(
  // eslint-disable-next-line
  protoLoader.loadSync(`${__dirname}/../proto/biz.proto`, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }),
).biz;

module.exports = proto;
