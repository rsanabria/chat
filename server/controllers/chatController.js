//variables globales
var io;
exports.init = function init(sckt) {
  io = sckt;
  return exports;
}

exports.inicio = function inicio(req, res) {
  res.render("inicio")
}

exports.chat = function chat(req, res) {
  res.render('chat');
}