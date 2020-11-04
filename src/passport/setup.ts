const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User } = require("../utils/db");
import * as JwtToken from "../utils/JwtToken";
import logger from "../utils/logger";

passport.serializeUser(async function (user: any, done: any) {
  const CurrentUser = await User.findOne({ where: { email: user.email } });
  CurrentUser._id = user.id;
  await CurrentUser.save();

  // const Token = JwtToken.generateJWT({
  //   id: CurrentUser.id,
  //   username: CurrentUser.username,
  //   email: CurrentUser.email,
  // });
  done(null, user.id);
});

passport.deserializeUser(async function (id: any, done: any) {
  console.log("deserializeUser", id);
  const CurrentUser = await User.findOne({ where: { _id: id } });
  done(null, { user: CurrentUser });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}${process.env.API_PATH}/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
      const newuser = await User.findOne({ where: { email: profile.email } });
      if (newuser === null) {
        const user = new User();
        user.username = profile.displayName;
        user.email = profile.email;
        user.emailVerifiedId = profile.email_verified;
        await user.save();
      }

      return done(null, profile);
    },
  ),
);

module.exports = passport;
