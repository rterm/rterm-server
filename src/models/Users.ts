const crypto = require("crypto");
const { DataTypes } = require("sequelize");

export = (sequelize: any) => {
  var User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    _id: {
      type: DataTypes.STRING(32),
      unique: true,
    },
    username: {
      type: DataTypes.STRING(36),
    },
    email: {
      type: DataTypes.STRING(254),
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerifiedId: {
      type: DataTypes.STRING(64),
      unique: true,
    },
    informations: {
      type: DataTypes.STRING(10000),
    },
    salt: {
      type: DataTypes.STRING(32),
      defaultValue: crypto.randomBytes(16).toString("hex"),
    },
    password: {
      type: DataTypes.STRING(1500),
      set(value: string) {
        const hash = crypto
          .pbkdf2Sync(value, (this as any).salt, 10000, 512, "sha512")
          .toString("hex");
        (this as any).setDataValue("password", hash);
      },
    },
  });
  User.sync({ alter: true });
  return User;
};
