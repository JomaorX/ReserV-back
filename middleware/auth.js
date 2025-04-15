const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    console.log('Usuario decodificado del token:', user);
    req.user = user; // Adjuntar el usuario decodificado a la solicitud
    next();
  });
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Requiere rol de administrador.' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };