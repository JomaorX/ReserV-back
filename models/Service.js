const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Salon = require("./Salon");

const Service = sequelize.define('Service', {
  salonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Salon, key: "id" },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false, // Duración en minutos
  },
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
});

module.exports = Service;