require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa cors
const bitacoraRoutes = require('./routes/BitacorasRoutes');
const usuarioRoutes = require('./routes/UsuariosRoutes'); 

const app = express();

// Middleware para habilitar CORS
app.use(cors()); // Permitir CORS para todas las rutas

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente!');
});

// Rutas de API
app.use('/api/bitacoras', bitacoraRoutes);
app.use('/api/usuarios', usuarioRoutes); // Añade esta línea para las rutas de usuarios

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
