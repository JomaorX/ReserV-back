const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnavailableDay = sequelize.define('UnavailableDay', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = UnavailableDay;