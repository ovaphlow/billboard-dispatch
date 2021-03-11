const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const proto = grpc.loadPackageDefinition(
  // eslint-disable-next-line
  protoLoader.loadSync(`${__dirname}/hypervisor.proto`, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }),
).hypervisor;

module.exports = proto;
