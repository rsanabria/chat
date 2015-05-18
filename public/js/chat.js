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
  socket.on('evitar conexion', function(ultimoUsuario){
    if(ultimoUsuario.usuario ==sessionStorage.getItem("usuario") ) {
    alert("Este Administrador esta atendiendo otra solicitud");
          window.location ="/usuario/listaAdmin";
    }

  });
  socket.on('newUser', function(nuevousuario){
     $("#chatlog").append('<b>Ha entrado al chat: ' + nuevousuario + '</b><br>');
    
  });
  socket.on('connect', function () {
      socket.emit("join room",sesion);
      socket.emit('contador');
    if(sessionStorage.getItem("admin") != undefined){
      socket.emit('NuevoUsuario',{usuario: sessionStorage.getItem("admin"), tipo: "admin"} );
      
    }
    if(sessionStorage.getItem("usuario") != undefined){
      socket.emit('NuevoUsuario',{usuario: sessionStorage.getItem("usuario"), tipo: "usuario"} );
      
    }
      
    
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
  socket.emit("eliminar usuario", sessionStorage.getItem("admin"));
  }
  if (sessionStorage.getItem("usuario") != undefined) {
      socket.emit("eliminar usuario", sessionStorage.getItem("usuario"));
  }
}
$(document).on('ready', init);

$(window).on('beforeunload', close);