import * as status from "../const/status";
const express = require("express");
import logger from "../utils/logger";
const NodePassport = require("../passport/setup");
const router = express.Router();

router.get("/login", function (req: any, res: any, next: any) {
  console.log("user", req.user);
  res.end("OK");
});

router.get("/user", async function (req: any, res: any) {
  logger.info(req.session);
  logger.info(req.user);
  logger.info(req.session.passport);
  logger.info(req.session.user);
  return res.json({
    status: status.SUCCESS,
    msg: "user",
  });
});

router.get("/google", NodePassport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  NodePassport.authenticate("google", {
    successRedirect: `${process.env.API_PATH}/auth/google/success`,
    failureRedirect: `${process.env.API_PATH}/auth/google/failure`,
  }),
);

router.get("/google/success", async function (req: any, res: any) {
  return res.json({
    status: 0,
    msg: "Google login successfully",
  });
});

router.get("/google/failure", async function (req: any, res: any) {
  return res.json({
    status: status.ERROR,
    code: status.GG_OAUTH_FAILED,
    msg: "Login error",
  });
});

module.exports = router;
