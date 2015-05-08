function init() {
  
  var socket = io.connect('http://localhost:3000/');
  var path = $(location).attr('pathname');
  
  var usuario = path.substr(path.lastIndexOf('/')+1, path.length);
  console.log(usuario);
  
  $("#enviar").keypress( function(event) {
         if (event.which == '13') {
            enviarMensaje();
            event.preventDefault();
        }
    });
  socket.on('evitar conexion', function(){
    alert("Este Administrador esta atendiendo otra solicitud");
    window.location ="/admin";
  })
  socket.on('connect', function () {
      socket.emit("join room",usuario);
      socket.emit('contador');
  });
  

  
  socket.on('message', function(data) {
            $("#chatlog").append(data.usuario+': ' +data.mensaje);
        $("#chatlog").append("<br>");
  });
  
  function enviarMensaje() {
    var mensaje =$("#enviar").val();
      socket.emit("join room",usuario);
    socket.emit('message', {usuario: sessionStorage.getItem('usuario'), mensaje: mensaje});
  }


}
$(document).on('ready', init);