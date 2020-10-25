const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const API_PATH = "/api/v1";

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening at http://${process.env.HOST}:${process.env.PORT}`),
);
