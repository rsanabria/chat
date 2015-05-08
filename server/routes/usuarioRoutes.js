var express     = require('express'),
    usuario        = require('../controllers/usuarioController'),
    usuarioRutas  = express.Router();

module.exports = function rutas(app, socket) {
  // Le pasamos el socket al controlador.
  usuario.init(socket); 
  usuarioRutas
    .get('/listaAdmin', usuario.listaAdmin);
  app.use('/usuario', usuarioRutas);
}

