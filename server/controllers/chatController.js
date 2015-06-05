//variables globales


exports.inicio = function inicio(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.sendfile('inicio.html', {'root': 'public/views/'});
  //res.render("inicio")
}

exports.chat = function chat(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.sendfile('chat.html', {'root': 'public/views/'});
  //res.render('chat');
}

exports.adminInicio = function adminInicio(req, res) {
  res.sendfile('AdminInicio.html', {'root': 'public/views/'});
}