const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Salon = require('./Salon');
const Employee = require("./Employee");
const Service = require("./Service");

const Reservation = sequelize.define(
  "Reservation",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    salonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Salon, key: "id" },
    },
    barberId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Employee, key: "id" },
    }, // 🔥 Relación con Employee
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Service, key: "id" },
    }, // 🔥 Relación con Service
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

Reservation.belongsTo(Employee, { foreignKey: "barberId", as: "barber" });
Reservation.belongsTo(Service, { foreignKey: "serviceId", as: "service" });
Reservation.belongsTo(Salon, { foreignKey: "salonId", as: "salon" });


module.exports = Reservation;