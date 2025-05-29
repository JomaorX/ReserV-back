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
