const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

// Importaciones
const sequelize = require('./config/database'); // Conexión a la base de datos
const User = require('./models/User'); // Modelo de usuario
const reservationRoutes = require('./routes/reservation'); // Rutas de reservas

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de ReserV');
});

// Endpoint para registro
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Respuesta exitosa
    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Endpoint para inicio de sesión
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, // Incluye el userId en el token
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Respuesta exitosa
    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    console.log('Este es el userId que se registra en el token',user.id)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    req.user = user; // Adjuntar el usuario decodificado a la solicitud
    next();
  });
};

// Ruta protegida
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Bienvenido al dashboard', user: req.user });
});

// Rutas de reservas
app.use('/api/reservations', reservationRoutes);

// Sincronizar la base de datos y arrancar el servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await sequelize.sync({ force: true }); // Sincroniza los modelos con la base de datos
    console.log('Base de datos sincronizada.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
});