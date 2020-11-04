const { Sequelize } = require("sequelize");
import UserModel from "../models/Users";
// const UserModel = require('../models/Users')
// const DeviceModel = require('../models/Devices')
// const NotificationModel = require('../models/Notifications')
const DBoptions = {
  user: process.env.DB_USERNAME,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const sequelize = new Sequelize(DBoptions.database, DBoptions.user, DBoptions.password, {
  host: DBoptions.host,
  dialect: "postgres",
  logging: false,
});

export const User = UserModel(sequelize);

// User.hasMany(Device, {
//   foreignKey: {
//     name: 'email',
//     allowNull: false
//   },
//   onDelete: 'cascade',
//   hooks: true
// })

// User.hasMany(Notification, {
//   foreignKey: {
//     name: 'email',
//     allowNull: false
//   },
//   onDelete: 'cascade',
//   hooks: true
// })

sequelize.sync({ alter: true });
