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
const salonRoutes = require("./routes/salons");

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
app.use("/api/salons", salonRoutes);


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
