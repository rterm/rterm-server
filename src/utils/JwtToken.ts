const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = process.env.JWT_SECRET;

export function sign(payload: any) {
  return jwt.sign(payload, secret);
}

export function verifyToken(req: any) {
  if (
    (req.headers.authorization && req.headers.authorization.split(" ")[0]) === "Token" ||
    (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
  return null;
}

export function validPassword(user: any, password: string) {
  var hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
  return user.password === hash;
}

export function verifyTokenRaw(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

export function generateJWT(user: any) {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return sign({
    id: user.id,
    username: user.displayName,
    email: user.email,
    exp: exp.getTime() / 1000,
  });
}

export function toAuthJSON(user: any) {
  return {
    displayName: user.displayName,
    email: user.email,
    token: generateJWT(user),
    bio: user.bio,
    image: user.image,
  };
}
