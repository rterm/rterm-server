const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const NodePassport = require("./passport/setup");

(global as any).express = express;
(global as any).passport = NodePassport;
const authRoute = require("./routes/auth");

const app = express();
const API_PATH = "/api/v1";

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(NodePassport.initialize());
app.use(NodePassport.session());
app.use(API_PATH + "/auth", authRoute);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening at http://${process.env.HOST}:${process.env.PORT}`),
);
