var express     = require('express'),
    chat        = require('../controllers/chatController'),
    chatRutas  = express.Router();

module.exports = function rutas(app) {

  chatRutas
    .get('/chat/:room',chat.chat)
    .get('/', chat.inicio)
    .get('/admin', chat.adminInicio);
  app.use('/', chatRutas);
}




