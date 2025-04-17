const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const Employee = require('../models/Employee');
const UnavailableDay = require('../models/UnavailableDay');
const Service = require('../models/Service');
const Salon = require('../models/Salon');

// Crear un nuevo empleado (solo para administradores)
router.post('/employees', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const employee = await Employee.create({ name, email, role });
    res.status(201).json({ message: 'Empleado creado exitosamente.', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el empleado.' });
  }
});

// Obtener todos los empleados (accesible para usuarios autenticados)
router.get('/employees', [authenticateToken], async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los empleados.' });
  }
});

// Actualizar un empleado (solo para administradores)
router.put('/employees/:id', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    await employee.update({ name, email, role });
    res.status(200).json({ message: 'Empleado actualizado correctamente.', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el empleado.' });
  }
});

// Eliminar un empleado (solo para administradores)
router.delete('/employees/:id', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado.' });
    }
    await employee.destroy();
    res.status(200).json({ message: 'Empleado eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el empleado.' });
  }
});

// Crear un día no disponible (solo para administradores)
router.post('/unavailable-days', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { date, reason } = req.body;
    const unavailableDay = await UnavailableDay.create({ date, reason });
    res.status(201).json({ message: 'Día no disponible agregado correctamente.', unavailableDay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el día no disponible.' });
  }
});

// Obtener todos los días no disponibles (solo para administradores)
router.get('/unavailable-days', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const unavailableDays = await UnavailableDay.findAll();
    res.status(200).json(unavailableDays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los días no disponibles.' });
  }
});

// Eliminar un día no disponible (solo para administradores)
router.delete('/unavailable-days/:id', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const unavailableDay = await UnavailableDay.findByPk(id);
    if (!unavailableDay) {
      return res.status(404).json({ message: 'Día no disponible no encontrado.' });
    }
    await unavailableDay.destroy();
    res.status(200).json({ message: 'Día no disponible eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el día no disponible.' });
  }
});

// Crear un nuevo servicio (solo para administradores)
router.post('/services', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const service = await Service.create({ name, description, price, duration });
    res.status(201).json({ message: 'Servicio creado exitosamente.', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el servicio.' });
  }
});

// Obtener todos los servicios (accesible para usuarios autenticados)
router.get('/services', [authenticateToken], async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los servicios.' });
  }
});

// Actualizar un servicio (solo para administradores)
router.put('/services/:id', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }
    await service.update({ name, description, price, duration });
    res.status(200).json({ message: 'Servicio actualizado correctamente.', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el servicio.' });
  }
});

// Eliminar un servicio (solo para administradores)
router.delete('/services/:id', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }
    await service.destroy();
    res.status(200).json({ message: 'Servicio eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el servicio.' });
  }
});

// Crear un nuevo salón (solo para administradores)
router.post('/salons', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { name, location, openingHours } = req.body;
    const newSalon = await Salon.create({
      ownerId: req.user.userId, // Asocia el salón con el administrador autenticado
      name,
      location,
      openingHours,
    });
    res.status(201).json({ message: 'Salón creado exitosamente.', salon: newSalon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el salón.' });
  }
});

// Obtener todos los salones (accesible para usuarios autenticados)
router.get('/salons', [authenticateToken], async (req, res) => {
  try {
    const salons = await Salon.findAll();
    if (!salons || salons.length === 0) {
      return res.status(404).json({ message: 'No hay salones registrados.' });
    }
    res.status(200).json(salons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los salones.' });
  }
});

// Obtener el salón del administrador autenticado
router.get('/salons/me', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const salon = await Salon.findOne({ where: { ownerId: req.user.userId } });
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }
    res.status(200).json(salon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el salón.' });
  }
});

// Actualizar un salón (solo para administradores)
router.put('/salons/:id', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, openingHours } = req.body;

    const salon = await Salon.findByPk(id);
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }

    // Verificar que el salón pertenezca al administrador autenticado
    if (salon.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes permiso para modificar este salón.' });
    }

    await salon.update({ name, location, openingHours });
    res.status(200).json({ message: 'Salón actualizado correctamente.', salon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el salón.' });
  }
});

module.exports = router;