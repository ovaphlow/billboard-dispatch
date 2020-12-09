const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const packageDefinition = protoLoader.loadSync(`${__dirname}/banner.proto`, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition).banner;

module.exports = proto;
