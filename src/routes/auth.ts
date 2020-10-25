const router = (global as any).express.Router();

router.get("/login", function(req: any, res: any, next: any) {
  console.log("/login");
  res.end("");
});

router.get(
  "/google",
  (global as any).passport.authenticate("google", { scope: ["profile", "email"] }),
);

// router.get(
//   "/google/callback",
//   (global as any).passport.authenticate("google", { failureRedirect: "/error" }),
//   function(req: any, res: any) {
//     // Successful authentication, redirect success.
//     res.redirect("/success");
//   },
// );

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/google/success",
    failureRedirect: "/api/v1/auth/google/failure",
  }),
);

module.exports = router;
