  var socket = io.connect('http://localhost:3000/');
function init() {
  

  var path = $(location).attr('pathname');
  
  var sesion = path.substr(path.lastIndexOf('/')+1, path.length);

  
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
      socket.emit("join room",sesion);
      socket.emit('contador');
  });
  

  
  socket.on('message', function(data) {
            $("#chatlog").append(data.usuario+': ' +data.mensaje);
        $("#chatlog").append("<br>");
  });
  
  function enviarMensaje() {
    var mensaje =$("#enviar").val();
    socket.emit("join room",sesion);
    if(sessionStorage.getItem("admin") != undefined) {
          socket.emit('message', {usuario: sessionStorage.getItem('admin'), mensaje: mensaje});
      
    } else {
      socket.emit('message', {usuario: sessionStorage.getItem('usuario'), mensaje: mensaje});
      
    }

  }


}
function close() {
  if (sessionStorage.getItem("admin") != undefined) {
  socket.emit("eliminar admin", sessionStorage.getItem("admin"));
  }
}
$(document).on('ready', init);

$(window).on('beforeunload', close);