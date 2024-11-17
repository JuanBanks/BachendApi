const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombreCompleto, email, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({
      nombreCompleto,
      email,
      contraseña, // La contraseña será encriptada en el middleware del modelo
      estado: true, // Estado activo por defecto
      rol: 'Colaborador' // Rol por defecto
    });

    const usuarioGuardado = await nuevoUsuario.save();

    // No es necesario retornar la contraseña
    const { contraseña: _, ...usuarioSinContraseña } = usuarioGuardado.toObject();

    res.status(201).json(usuarioSinContraseña); // Retornar el usuario sin la contraseña
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
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol, Nombre: usuario.nombreCompleto  }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, rol: usuario.rol, Nombre: usuario.nombreCompleto }); // Retornar el rol junto con el token
    
  } catch (error) {
    res.status(400).json({ message: 'Error al iniciar sesión', error });
  }
});

// Ruta para obtener todos los usuarios (panel de administración)
router.get('/', async (req, res) => { // Cambiado a '/'
  try {
    // Buscar todos los usuarios y excluir la contraseña
    const usuarios = await Usuario.find({}, '-contraseña');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
});

// Ruta para actualizar el estado de un usuario
router.put('/:id/estado', async (req, res) => { // Cambiado a ':id/estado'
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Actualizar el estado del usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { estado }, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el estado del usuario', error });
  }
});

// Ruta para actualizar el rol de un usuario
router.put('/:id/rol', async (req, res) => { // Cambiado a ':id/rol'
  try {
    const { id } = req.params;
    const { rol } = req.body;

    // Validar que el rol es uno de los permitidos
    if (!['Colaborador', 'Administrador', 'Investigador'].includes(rol)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    // Actualizar el rol del usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { rol }, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el rol del usuario', error });
  }
});

module.exports = router;
