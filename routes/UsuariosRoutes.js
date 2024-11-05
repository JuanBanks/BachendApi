const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombreCompleto, email, contraseña } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombreCompleto, email, contraseña: hashedPassword });
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar el usuario', error });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Error al iniciar sesión', error });
  }
});

module.exports = router;
