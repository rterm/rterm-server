const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser(function(user: any, done: any) {
  console.log("passport.serializeUser: user", user.email);
  done(null, user.id);
});

passport.deserializeUser(function(id: any, done: any) {
  console.log("passport.deserializeUser: id", id);
  // User.findById(id, (err: any, user: any) => {
  //   done(err, user)
  // })
  done(null, { user: "Lee" });

  // done(null, id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}${process.env.API_PATH}/auth/google/callback`,
      passReqToCallback: true,
    },
    function(request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
      console.log("GG login");
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      return done(null, profile);
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
    },
  ),
);

module.exports = passport;
