import * as status from "../constants/status";
const express = require("express");
import logger from "../utils/logger";
const NodePassport = require("../passport/setup");
const router = express.Router();
import * as mail from "../utils/mail";
import * as encryption from "../utils/encryption";
import * as jwttoken from "../utils/JwtToken";
const { User } = require("../utils/db");

router.post("/signup", async function (req: any, res: any) {
  if (req.body.password !== req.body.confirm_password) {
    return res.json({
      status: status.PASS_NOT_MATCHED,
      msg: "Password confirm do not match",
    });
  }

  const checkuser = await User.findOne({ where: { email: req.body.email } });
  if (checkuser !== null) {
    if (checkuser.emailVerified) {
      return res.json({
        status: status.EMAIL_ALREADY_EXISTS,
        msg: "Email already exists and register successfully",
      });
    } else {
      await checkuser.destroy();
    }
  }

  const emailVerifiedId = encryption.genid().replace(/-/g, "");

  const user = new User();
  user.displayName = req.body.display_name;
  user.givenName = req.body.given_name;
  user.familyName = req.body.family_name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.emailVerifiedId = emailVerifiedId;
  await user.save();

  // const content = `
  // <h2 style="color: #2e6c80;">Click on this link to verify your email:</h2>
  // <p><strong>&nbsp;<a href="${process.env.BASE_URL}/verifyemail?id=${emailVerifiedId}">${process.env.BASE_URL}/verifyemail?id=${emailVerifiedId}</a></strong></p>
  // `;
  // mail.send(req.body.email, "iLogger Email Verification", content);

  if (checkuser !== null && checkuser.emailVerified === false) {
    return res.json({
      status: status.UNKNOWN,
      msg: "Email already exists but has not been verified, please check your mailbox",
    });
  } else {
    return res.json({
      status: status.SUCCESS,
      msg: "Signup successfully, please check your mailbox to verify your email",
    });
  }
});

router.post(
  "/login",
  NodePassport.authenticate("local", {
    successRedirect: `${process.env.API_PATH}/auth/local/success`,
    failureRedirect: `${process.env.API_PATH}/auth/local/failure`,
  }),
);

router.get("/user", async function (req: any, res: any) {
  return res.json({
    status: status.SUCCESS,
    msg: "user",
    user: req.user.jwt,
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

router.get("/local/success", async function (req: any, res: any) {
  if (req.user.emailVerified === false) {
    return res.json({
      status: status.UNKNOWN,
      msg: "Email already exists but has not been verified, please check your mailbox",
    });
  } else {
    req.user.bio = null;
    req.user.image = null;
    req.user.jwt = jwttoken.toAuthJSON(req.user);
    return res.json({
      status: 0,
      msg: "Local login successfully",
      data: {
        user: req.user.jwt,
      },
    });
  }
});

router.get("/local/failure", async function (req: any, res: any) {
  return res.json({
    status: status.ERROR,
    code: status.GG_OAUTH_FAILED,
    msg: "Local login error",
  });
});

router.get("/google/success", async function (req: any, res: any) {
  req.user.bio = null;
  req.user.image = null;
  req.user.jwt = jwttoken.toAuthJSON(req.user);
  return res.json({
    status: 0,
    msg: "Google login successfully",
    data: {
      user: req.user.jwt,
    },
  });
});

router.get("/google/failure", async function (req: any, res: any) {
  return res.json({
    status: status.ERROR,
    code: status.GG_OAUTH_FAILED,
    msg: "Google login error",
  });
});

module.exports = router;
