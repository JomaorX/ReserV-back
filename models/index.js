const User = require('./User');
const Reservation = require('./Reservation');
const Employee = require('./Employee');
const Service = require('./Service');
const Salon = require('./Salon');

// Relaciones
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Employee.hasMany(Reservation, { foreignKey: 'barberId' }); // Relación con el peluquero
Reservation.belongsTo(Employee, { foreignKey: 'barberId' });

Service.hasMany(Reservation, { foreignKey: 'serviceId' }); // Relación con el servicio
Reservation.belongsTo(Service, { foreignKey: 'serviceId' });

// Relación entre User y Salon
User.hasOne(Salon, { foreignKey: 'ownerId' }); // Un administrador puede tener un salón
Salon.belongsTo(User, { foreignKey: 'ownerId' }); // Un salón pertenece a un administrador

module.exports = {
  User,
  Reservation,
  Employee,
  Service,
  Salon,
};

// Relaciones :
// Un usuario puede tener muchas reservas.
// Un empleado puede ser asignado a muchas reservas.
// Un servicio puede estar asociado a muchas reservas.