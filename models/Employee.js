const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('stylist', 'receptionist', 'manager', 'cleaner'), // Rol del empleado (administrador o peluquero)
    defaultValue: 'stylist',
  },
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
});

module.exports = Employee;