const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Salon = require("./Salon");

const UnavailableDay = sequelize.define(
  "UnavailableDay",
  {
    salonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Salon, key: "id" },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UnavailableDay;