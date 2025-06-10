const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Salon = require("./Salon");

const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("client", "admin"), defaultValue: "client" },
    salonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Salon, key: "id" },
    },
  },
  {
    timestamps: true,
  }
);


User.belongsTo(Salon, { foreignKey: "salonId" });
Salon.hasOne(User, { foreignKey: "salonId" });

module.exports = User;