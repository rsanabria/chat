var express     = require('express'),
    usuario        = require('../controllers/usuarioController'),
    usuarioRutas  = express.Router();

module.exports = function rutas(app) {
  // Le pasamos el socket al controlador.
  usuarioRutas
    .get('/listaAdmin', usuario.listaAdmin);
  app.use('/usuario', usuarioRutas);
}

