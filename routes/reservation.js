const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const authMiddleware = require('../middleware/auth'); // Middleware para verificar el token JWT

// Crear una nueva reserva
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { salonId, barber, service, date, time } = req.body;

    const reservation = await Reservation.create({
      userId: req.user.userId,
      salonId,
      barber,
      service,
      date,
      time,
      status: 'pending',
    });

    res.status(201).json({ message: 'Reserva creada exitosamente.', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la reserva.', userId: `${req.user.id}` });
  }
});

// Obtener todas las reservas del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Obtenido del middleware de autenticación
    const reservations = await Reservation.findAll({ where: { userId } });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reservas.' });
  }
});

// Actualizar una reserva existente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { barber, service, date, time } = req.body;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenezca al usuario autenticado
    if (reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta reserva.' });
    }

    await reservation.update({ barber, service, date, time });
    res.status(200).json({ message: 'Reserva actualizada correctamente.', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la reserva.' });
  }
});

// Eliminar una reserva
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenezca al usuario autenticado
    if (reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reserva.' });
    }

    await reservation.destroy();
    res.status(200).json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la reserva.' });
  }
});

module.exports = router;