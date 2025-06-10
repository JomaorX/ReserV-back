const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendConfirmationEmail = async (to, reservation) => {
  // Leer la plantilla del correo
  const templatePath = path.join(__dirname, "templates/emailTemplate.html");
  let emailTemplate = fs.readFileSync(templatePath, "utf8");

  // Reemplazar placeholders con los datos reales
  emailTemplate = emailTemplate
    .replace(
      "{{salonName}}",
      reservation.salon ? reservation.salon.name : "No especificado"
    )
    .replace(
      "{{salonLocation}}",
      reservation.salon ? reservation.salon.location : "No especificado"
    )
    .replace(
      "{{barberName}}",
      reservation.barber ? reservation.barber.name : "No especificado"
    )
    .replace(
      "{{serviceName}}",
      reservation.service ? reservation.service.name : "No especificado"
    )
    .replace("{{date}}", reservation.date)
    .replace(
      "{{time}}",
      new Date(reservation.time).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

  // Configuración del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Confirmación de Reserva",
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de confirmación enviado.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = { sendConfirmationEmail };
