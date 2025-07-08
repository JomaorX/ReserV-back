
// Crear un nuevo salón (solo para administradores)
router.post('/salons', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const { name, location, openingHours } = req.body;

    console.log("🛠️ Creando nuevo salón para usuario:", req.user.userId);
    
    const newSalon = await Salon.create({
      ownerId: req.user.userId,
      name,
      location,
      openingHours,
    });
    
    console.log("✅ Salón creado con ID:", newSalon.id);

    await User.update(
      { salonId: newSalon.id },
      { where: { id: req.user.userId }, individualHooks: true }
    );

    console.log("🔄 Usuario actualizado con nuevo salonId");

    const updatedUser = await User.findByPk(req.user.userId);
    console.log(
      "🧾 Verificación - salonId del usuario en BD:",
      updatedUser ? updatedUser.salonId : "Usuario no encontrado"
    );

    res.status(201).json({ message: 'Salón creado exitosamente.', salon: newSalon });

  } catch (error) {
    console.error("❌ Error al crear salón:", error);
    res.status(500).json({ message: 'Error al crear el salón.' });
  }
});


// Obtener todos los salones (accesible para usuarios autenticados)
router.get('/salons', [authenticateToken], async (req, res) => {
  try {
    const salons = await Salon.findAll();
    if (!salons || salons.length === 0) {
      return res.status(404).json({ message: 'No hay salones registrados.' });
    }
    res.status(200).json(salons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los salones.' });
  }
});

// Obtener el salón del administrador autenticado
router.get('/salons/me', [authenticateToken, isAdmin], async (req, res) => {
  try {
    const salon = await Salon.findOne({ where: { ownerId: req.user.userId } });
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }
    res.status(200).json(salon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el salón.' });
  }
});

// Actualizar un salón (solo para administradores)
router.put('/salons/:id', [authenticateToken, isAdmin], async (req, res) => {
  console.log("🚨 Se llamó a PUT /salons");
  try {
    const { id } = req.params;
    const { name, location, openingHours, bannerUrl } = req.body;
    
    console.log("🔍 Buscando salón con ID:", id);
    
    const salon = await Salon.findByPk(id);
    if (!salon) {
      console.log("❌ Salón no encontrado");
      return res.status(404).json({ message: 'Salón no encontrado.' });
    }

    if (salon.ownerId !== req.user.userId) {
      console.log("⛔ Intento de modificación no autorizado por userId:", req.user.userId);
      return res.status(403).json({ message: 'No tienes permiso para modificar este salón.' });
    }

    console.log("✏️ Actualizando salón con nuevos datos");

    await salon.update({ name, location, openingHours, bannerUrl });

    console.log(
      "🔄 Actualizando salonId del usuario a:",
      salon.id
    );

    await User.update(
      { salonId: salon.id },
      { where: { id: req.user.userId }, individualHooks: true }
    );

    const updatedUser = await User.findByPk(req.user.userId);
    console.log(
      "🧾 Verificación - salonId del usuario en BD:",
      updatedUser ? updatedUser.salonId : "Usuario no encontrado"
    );
    
    res.status(200).json({ message: 'Salón actualizado correctamente.', salon });
    
  } catch (error) {
    console.error("❌ Error al actualizar salón:", error);
    res.status(500).json({ message: 'Error al actualizar el salón.' });
  }
});

// GET /api/salons/:id - Obtener un salón por ID
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findByPk(req.params.id);
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }
    res.json(salon);
  } catch (error) {
    console.error('Error al obtener salón:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
