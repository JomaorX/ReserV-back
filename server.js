// ---------- IMPORTACIONES ----------
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// ---------- CONFIGURAR SUBIDA DE ARCHIVOS ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `img-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ---------- IMPORTAR DB Y MODELOS ----------
const sequelize = require('./config/database');
const User = require('./models/User');
const Salon = require('./models/Salon');
const reservationRoutes = require('./routes/reservation');
const adminRoutes = require('./routes/admin');

// ---------- MIDDLEWARES ----------
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// ---------- JWT SECRET ----------
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// ---------- ENDPOINTS ----------
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de ReserV');
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

app.post('/api/login', async (req, res) => {
  console.log("Login request received");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Credenciales incorrectas." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Credenciales incorrectas." });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, salonId: user.salonId },
      JWT_SECRET,
      { expiresIn: "78h" }
    );
    res.status(200).json({ message: "Inicio de sesión exitoso.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// ---------- AUTH MIDDLEWARE ----------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
};

// ---------- GET SALÓN ACTUAL DEL USUARIO ----------
app.get('/api/salons/me', authenticateToken, async (req, res) => {
  try {
    const salon = await Salon.findOne({ where: { ownerId: req.user.userId } });
    if (!salon) return res.status(404).json({ message: 'No tienes salón aún.' });
    res.json(salon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el salón' });
  }
});

// ---------- LISTAR TODOS LOS SALONES (para clientes) ----------
app.get('/api/salons', async (req, res) => {
  try {
    const { salonId } = req.query;
    console.log("Salon recibido",salonId);
    let salon;
    if (salonId) {
      salon = await Salon.findAll({ where: { id: salonId } });
    }else {
      salon = await Salon.findAll({
        attributes: ['id', 'name', 'openingHours', 'bannerUrl']
      });
    }
    res.json(salon);
  } catch (error) {
    console.error('Error al obtener los salones:', error);
    res.status(500).json({ message: 'Error al obtener los salones' });
  }
});

// ---------- OBTENER UN SALÓN POR ID ----------
app.get('/api/salons/:id', async (req, res) => {
  try {
    const salon = await Salon.findByPk(req.params.id);
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }
    res.json(salon);
  } catch (error) {
    console.error('Error al obtener salón por ID:', error);
    res.status(500).json({ message: 'Error al obtener el salón' });
  }
});

// ---------- CREAR SALÓN ----------
app.post('/api/salons', authenticateToken, async (req, res) => {
  try {
    const { name, location, openingHours, bannerUrl } = req.body;
    const newSalon = await Salon.create({
      ownerId: req.user.userId,
      name,
      location,
      openingHours,
      bannerUrl,
    });
    await User.update(
      { salonId: newSalon.id },
      { where: { id: req.user.userId } }
    );
    // 🔁 Volver a buscar el usuario actualizado
    const updatedUser = await User.findByPk(req.user.userId);

    // 🆕 Generar nuevo token
    const updatedToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        salonId: updatedUser.salonId,
      },
      JWT_SECRET,
      { expiresIn: "78h" }
    );
    res.status(201).json({
      message: "Salón creado con éxito",
      salon: newSalon,
      token: updatedToken, // ✅ Incluir el nuevo token en la respuesta
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el salón' });
  }
});

// ---------- ACTUALIZAR SALÓN ----------
app.put('/api/salons/:id', authenticateToken, async (req, res) => {
  try {
    const salon = await Salon.findOne({ where: { id: req.params.id, ownerId: req.user.userId } });
    if (!salon) return res.status(404).json({ message: 'Salón no encontrado.' });
    const { name, location, openingHours, bannerUrl } = req.body;
    await salon.update({ name, location, openingHours, bannerUrl });
    await User.update(
      { salonId: salon.id },
      { where: { id: req.user.userId } }
    );
    res.json({
      message: "Salón actualizado con éxito",
      salon
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el salón' });
  }
});

// ---------- SUBIDA DE IMAGEN (LOCAL) ----------
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ---------- RUTAS PERSONALIZADAS ----------
app.use('/api/reservations', reservationRoutes);
app.use('/api', adminRoutes);

// ---------- INICIAR SERVIDOR ----------
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await sequelize.sync({
      //force: true, // Actualiza el esquema sin borrar datos // {force: true}, borra todo y la deja limpia, y si no con alter: true que solo te actializa las cosas nuevas de los modelos sin borrar datos
      logging: console.log, // Opcional: Ver qué cambios hace
    });
    console.log('Base de datos sincronizada.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
});
