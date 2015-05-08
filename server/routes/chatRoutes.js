var express     = require('express'),
    chat        = require('../controllers/chatController'),
    chatRutas  = express.Router();

module.exports = function rutas(app, socket) {
  // Le pasamos el socket al controlador.
  chat.init(socket); 
  //Iniciamos el servicio socketIO
  chatRutas
    .get('/chat/:room',chat.chat)
    .get('/inicio', chat.inicio);
  app.use('/', chatRutas);
}




