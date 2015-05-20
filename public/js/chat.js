  var socket = io.connect('http://localhost:3000/');
  var control = true;
function init() {
  

  var path = $(location).attr('pathname');
  
  
  var sesion = path.substr(path.lastIndexOf('/')+1, path.length);


  $("#enviar").keypress( function(event) {
         if (event.which == '13') {
            enviarMensaje();
            event.preventDefault();
        }
    });

  socket.on('newUser', function(nuevousuario){
     $("#chatlog").append('<b>Ha entrado al chat: ' + nuevousuario + '</b><br>');
    
  });
  socket.on('connect', function () {
      socket.emit("join room",sesion);
    if(sessionStorage.getItem("admin") != undefined){
      socket.emit('NuevoUsuario',{usuario: sessionStorage.getItem("admin"), tipo: "admin"} );
      
    }
    if(sessionStorage.getItem("usuario") != undefined){
      socket.emit('NuevoUsuario',{usuario: sessionStorage.getItem("usuario"), tipo: "usuario"} );
      
    }
    socket.emit('contador');
      socket.on('evitar conexion', function(ultimoUsuario){
    console.log(ultimoUsuario.usuario + " " + sessionStorage.getItem("usuario") )
    if(ultimoUsuario.usuario ==sessionStorage.getItem("usuario") ) {
    alert("Este Administrador esta atendiendo otra solicitud");
        control = false;
          window.location ="/usuario/listaAdmin";
    }

  });
    

      
    
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
    socket.emit('message', {usuario : "Ha salido", mensaje:  sessionStorage.getItem("admin")});    
  //$("#chatlog").append('<b>Ha salido ' + sessionStorage.getItem("admin") + '</b><br>');
  }
  if (sessionStorage.getItem("usuario") != undefined) {
      socket.emit("eliminar usuario", sessionStorage.getItem("usuario"));
    console.log(control);
      if(control == true)
        socket.emit('message', {usuario : "Ha Salido", mensaje: sessionStorage.getItem("usuario")}); 
    //$("#chatlog").append('<b>Ha salido ' + sessionStorage.getItem("usuario") + '</b><br>');
  }
}
$(document).on('ready', init);

$(window).on('beforeunload', close);