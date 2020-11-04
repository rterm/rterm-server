const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const NodePassport = require("./passport/setup");
import { defineAbilityFor } from "./utils/abilities";

const app = express();
app.use(express.static("public"));
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
app.use((req: any, _: any, next: any) => {
  req.user = { role: "guest" };
  req.ability = defineAbilityFor(req.user);
  next();
});
app.use(process.env.API_PATH + "/auth", require("./routes/auth"));

const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening at http://${process.env.HOST}:${process.env.PORT}`),
);
