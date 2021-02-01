const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

// eslint-disable-next-line
const packageDefinition = protoLoader.loadSync(`${__dirname}/recommend.proto`, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).recommend;

module.exports = proto;
