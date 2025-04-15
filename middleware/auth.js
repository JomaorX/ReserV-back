const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey', (err, decodedUser) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    console.log('Usuario decodificado:', decodedUser); // Verifica qué contiene decodedUser
    req.user = decodedUser; // Adjuntar el usuario decodificado a la solicitud
    next();
  });
};

module.exports = authenticateToken;