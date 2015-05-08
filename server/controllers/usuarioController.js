//variables globales
var io;
exports.init = function init(sckt) {
  io = sckt;
  return exports;
}

exports.listaAdmin = function listaAdmin(req, res) {
  res.render("listaAdmin");
}



 