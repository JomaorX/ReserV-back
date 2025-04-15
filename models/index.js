const User = require('./User');
const Reservation = require('./Reservation');
const Employee = require('./Employee');
const Service = require('./Service');

// Relaciones
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Employee.hasMany(Reservation, { foreignKey: 'barberId' }); // Relación con el peluquero
Reservation.belongsTo(Employee, { foreignKey: 'barberId' });

Service.hasMany(Reservation, { foreignKey: 'serviceId' }); // Relación con el servicio
Reservation.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = {
  User,
  Reservation,
  Employee,
  Service,
};

// Relaciones :
// Un usuario puede tener muchas reservas.
// Un empleado puede ser asignado a muchas reservas.
// Un servicio puede estar asociado a muchas reservas.