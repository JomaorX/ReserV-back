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
      allowNull: true, // Solo los administradores tendrán un salón
      references: { model: Salon, key: "id" },
    },
  },
  {
    timestamps: true,
  }
);


Salon.belongsTo(User, { foreignKey: 'ownerId' }); // Un salón pertenece a un administrador
User.hasOne(Salon, { foreignKey: 'ownerId' }); // Un administrador tiene un salón
module.exports = User;