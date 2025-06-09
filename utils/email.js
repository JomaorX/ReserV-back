const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otros servicios como Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASSWORD, // Tu contraseña o app password
  },
});

// Función para enviar correos
const sendConfirmationEmail = async (to, reservation) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'reserv.platform@gmail.com', // Dirección fija para pruebas
    replyTo: process.env.EMAIL_USER,
    subject: 'Confirmación de Reserva',
    text: `Tu reserva ha sido creada exitosamente:\n\n` +
      `Peluquero: ${reservation.barber}\n` +
      `Servicio: ${reservation.service}\n` +
      `Fecha: ${reservation.date}\n` +
      `Hora: ${reservation.time}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación enviado.');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = { sendConfirmationEmail };