const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const express = require("express");
const app = express();
// Load protobuf
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../proto", "hello.proto"),
  {
    keepCase: true,
    longs: String,
    defaults: true,
    oneofs: true,
  }
);
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

const userPackgeDefinition = protoLoader.loadSync(
  path.join(__dirname, "../proto", "user.proto"),
  {
    keepCase: true,
    longs: String,
    defaults: true,
    oneofs: true,
  }
);
const userPorto = grpc.loadPackageDefinition(userPackgeDefinition).user;

// Create a client
const client = new helloProto.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Call the SayHello method
client.SayHello({ name: "World" }, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Greeting:", response.message);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const secondClient = new helloProto.Second(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  secondClient.sayHi({ name: "John" }, (error, response) => {
    if (error) {
      console.error(error);
    } else {
      res.send(response.message);
    }
  });
});

app.post("/createUser", (req, res) => {
  const { user } = req.body;
  const userClient = new userPorto.CreatUser(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  userClient.creatUser({user}, (err, response) => {
    if (err) {
      console.log(err)
      res.send(err);}
    else {
      console.log(response.user)
      res.send(response.user);
    }
  });
});
app.listen(4000, () => {
  console.log(`Express server running on http://localhost:${4000}`);
});
