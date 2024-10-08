const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const helloPackgeDefinition = protoLoader.loadSync(path.join(__dirname, '../proto', 'hello.proto'), {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});
const helloProto = grpc.loadPackageDefinition(helloPackgeDefinition).hello;

const userPackgeDefinition = protoLoader.loadSync(path.join(__dirname, '../proto', 'user.proto'), {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});
const userPorto = grpc.loadPackageDefinition(userPackgeDefinition).user;




function sayHello(call, callback) {
  const reply = { message: `Hello ${call.request.name}` };
  callback(null, reply);
}
function sayHi(call, callback) {
  const reply = { message: `Hi ${call.request.name}` };
  callback(null, reply);
}
const userModel=[]

function creatUser(call,callBack){
  const {user}=call.request;
  console.log(user.name)
  userModel.push(user);
  const replay={message:`user created\n new user`,user:{name:user.name,email:user.email}}
  callBack(null,replay);
}


const server = new grpc.Server();
server.addService(helloProto.Greeter.service, { SayHello: sayHello });
server.addService(helloProto.Second.service, { sayHi: sayHi });
server.addService(userPorto.CreatUser.service,{creatUser})


const grpcPort = '50051';
server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running on port ${grpcPort}`);
  server.start();
});
