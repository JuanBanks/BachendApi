const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const usuarioSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
});

// Middleware de Mongoose para encriptar la contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (this.isModified('contraseña') || this.isNew) {
    try {
      // Genera un hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      this.contraseña = await bcrypt.hash(this.contraseña, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
