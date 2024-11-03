const mongoose = require('mongoose');

const especieSchema = new mongoose.Schema({
  nombreCientifico: { type: String, required: false },
  nombreComun: { type: String, required: true },
  familia: { type: String, required: false },
  cantidadMuestras: { type: Number, required: true },
  estadoPlanta: { type: String, required: true },
  fotos: [{ type: String }], // Array de URLs o nombres de archivos de fotos
});

const bitacoraSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  fechaHoraMuestreo: { type: Date, required: true },
  localizacion: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true },
  },
  condicionesClimaticas: { type: String, required: true },
  descripcionHabitat: { type: String, required: true },
  fotosSitio: [{ type: String }], // Array de URLs o nombres de archivos de fotos
  especiesRecolectadas: [especieSchema], // Array de detalles de especies recolectadas
  observacionesAdicionales: { type: String },
  estadoActivo: { type: Boolean, default: true },
});

module.exports = mongoose.model('Bitacora', bitacoraSchema);
