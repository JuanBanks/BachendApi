const express = require('express');
const router = express.Router();
const Bitacora = require('../models/Bitacora');

// Ruta para crear una nueva bitácora
router.post('/', async (req, res) => {
  try {
    const nuevaBitacora = new Bitacora(req.body);
    const bitacoraGuardada = await nuevaBitacora.save();
    res.status(201).json(bitacoraGuardada);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la bitácora', error });
  }
});

// Ruta para obtener todas las bitácoras
router.get('/', async (req, res) => {
  try {
    const bitacoras = await Bitacora.find();
    res.status(200).json(bitacoras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las bitácoras', error });
  }
});

// Ruta para obtener una bitácora específica por ID
router.get('/:id', async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.id);
    if (bitacora) {
      res.status(200).json(bitacora);
    } else {
      res.status(404).json({ message: 'Bitácora no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la bitácora', error });
  }
});

// Ruta para actualizar una bitácora
router.put('/:id', async (req, res) => {
  try {
    const bitacoraActualizada = await Bitacora.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(bitacoraActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la bitácora', error });
  }
});

// Ruta para eliminar una bitácora
router.delete('/:id', async (req, res) => {
  try {
    await Bitacora.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bitácora eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la bitácora', error });
  }
});

module.exports = router;
