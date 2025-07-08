const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Salon, User } = require("../models"); // Ajusta el path si es necesario
const JWT_SECRET = process.env.JWT_SECRET;




// ---------- MIDDLEWARES ----------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Token no proporcionado." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token inválido o expirado." });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: "Acceso restringido a administradores." });
  next();
};

// Obtener el salón del administrador autenticado
router.get("/me", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const salon = await Salon.findOne({ where: { ownerId: req.user.userId } });
    if (!salon) {
      return res.status(404).json({ message: "Salón no encontrado." });
    }
    res.status(200).json(salon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el salón." });
  }
});

// ---------- CREAR SALÓN ----------
router.post('/', authenticateToken, async (req, res) => {
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

    const updatedUser = await User.findByPk(req.user.userId);

    const updatedToken = jwt.sign({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      salonId: updatedUser.salonId
    }, JWT_SECRET, { expiresIn: "78h" });

    res.status(201).json({ message: "Salón creado con éxito", salon: newSalon, token: updatedToken });
  } catch (error) {
    console.error("❌ Error al crear salón:", error);
    res.status(500).json({ message: "Error al crear el salón" });
  }
});

// ---------- ACTUALIZAR SALÓN ----------
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const salon = await Salon.findOne({
      where: { id: req.params.id, ownerId: req.user.userId }
    });

    if (!salon)
      return res.status(404).json({ message: "Salón no encontrado." });

    const { name, location, openingHours, bannerUrl } = req.body;
    await salon.update({ name, location, openingHours, bannerUrl });

    await User.update(
      { salonId: salon.id },
      { where: { id: req.user.userId } }
    );

    res.json({ message: "Salón actualizado con éxito", salon });
  } catch (error) {
    console.error("❌ Error al actualizar salón:", error);
    res.status(500).json({ message: "Error al actualizar el salón" });
  }
});

// ---------- OBTENER TU SALÓN ----------
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const salon = await Salon.findOne({ where: { ownerId: req.user.userId } });
    if (!salon)
      return res.status(404).json({ message: "No tienes salón aún." });

    res.json(salon);
  } catch (error) {
    console.error("❌ Error al obtener salón:", error);
    res.status(500).json({ message: "Error al obtener el salón" });
  }
});

// ---------- LISTAR TODOS LOS SALONES O UNO POR ID ----------
router.get('/', async (req, res) => {
  try {
    const { salonId } = req.query;
    let salons;

    if (salonId) {
      salons = await Salon.findAll({ where: { id: salonId } });
    } else {
      salons = await Salon.findAll({
        attributes: ["id", "name", "openingHours", "bannerUrl"]
      });
    }

    res.json(salons);
  } catch (error) {
    console.error("❌ Error al obtener salones:", error);
    res.status(500).json({ message: "Error al obtener los salones" });
  }
});

// ---------- OBTENER SALÓN POR ID ----------
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findByPk(req.params.id);
    if (!salon)
      return res.status(404).json({ message: "Salón no encontrado" });

    res.json(salon);
  } catch (error) {
    console.error("❌ Error al obtener salón:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;
