const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { authenticateToken } = require('../middleware/auth');
const { sendConfirmationEmail } = require('../utils/email');
const User = require('../models/User'); // Importa el modelo de usuario

// Crear una nueva reserva
router.post('/', authenticateToken, async (req, res) => {
  try {

    console.log('Datos recibidos en la solicitud:', req.body); // Log de los datos recibidos
    console.log('Usuario autenticado:', req.user); // Log del usuario autenticado
    
    const { salonId, barber, service, date, time } = req.body;

    // Crear la reserva
    const reservation = await Reservation.create({
      userId: req.user.userId,
      salonId,
      barber,
      service,
      date,
      time,
      status: 'pending',
    });

    // Obtener el correo del usuario
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Enviar correo de confirmación
    await sendConfirmationEmail(user.email, reservation);

    res.status(201).json({ message: 'Reserva creada exitosamente.', reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la reserva.' });
  }
});

// Obtener todas las reservas del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Obtenido del middleware de autenticación
    const reservations = await Reservation.findAll({ where: { userId } });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reservas.' });
  }
});

// Actualizar una reserva existente
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { barber, service, date, time } = req.body;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenezca al usuario autenticado
    if (reservation.userId !== req.user.userId) {
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
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenezca al usuario autenticado
    if (reservation.userId !== req.user.userId) {
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