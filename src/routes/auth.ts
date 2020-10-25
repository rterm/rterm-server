const router = (global as any).express.Router();

router.get("/login", function(req: any, res: any, next: any) {
  console.log("/login");
  res.end("");
});

module.exports = router;
