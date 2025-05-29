const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salon = sequelize.define('Salon', {
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  openingHours: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bannerUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  }
}, {
  timestamps: true,
});

module.exports = Salon;
