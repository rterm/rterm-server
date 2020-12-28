const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User } = require("../utils/db");
import * as jwttoken from "../utils/JwtToken";
import logger from "../utils/logger";

passport.serializeUser(async function (user: any, done: any) {
  console.log("serializeUser", user.email);
  const CurrentUser = await User.findOne({ where: { email: user.email } });
  done(null, CurrentUser.id);
});

passport.deserializeUser(async function (id: any, done: any) {
  console.log("deserializeUser", id);
  const CurrentUser = await User.findOne({ where: { id: id } });
  done(null, CurrentUser.dataValues);
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email: string, password: string, done: any) => {
      const user = await User.findOne({ where: { email: email } });
      if (user === null) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!jwttoken.validPassword(user, password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    },
  ),
);

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
        user.displayName = profile.displayName;
        user.givenName = profile.given_name;
        user.familyName = profile.family_name;
        user.email = profile.email;
        user.emailVerified = profile.email_verified;
        await user.save();
        return done(null, user);
      }

      return done(null, newuser);
    },
  ),
);

module.exports = passport;
