const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const proto = grpc.loadPackageDefinition(
  // eslint-disable-next-line
  protoLoader.loadSync(`${__dirname}/miscellaneus.proto`, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }),
).miscellaneus;

module.exports = proto;
