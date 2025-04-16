const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salon = sequelize.define('Salon', {
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Relaciona el salón con el ID del administrador
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Nombre del salón
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false, // Ubicación del salón
    },
    openingHours: {
      type: DataTypes.STRING,
      allowNull: false, // Horario de apertura (ej. "9:00 AM - 6:00 PM")
    },
  }, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  });

  module.exports = Salon;