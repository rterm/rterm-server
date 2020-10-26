const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const NodePassport = require("./passport/setup");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }),
);

app.use(NodePassport.initialize());
app.use(NodePassport.session());
app.use(process.env.API_PATH + "/auth", require("./routes/auth"));
app.use(express.static("public"));

const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening at http://${process.env.HOST}:${process.env.PORT}`),
);
