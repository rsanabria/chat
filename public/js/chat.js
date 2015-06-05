  var socket = io.connect('http://localhost:3000/');
  var control = true;
function init() {
  

  var path = $(location).attr('pathname');
  
  
  var sesion = path.substr(path.lastIndexOf('/')+1, path.length);


  $("#enviar").keypress( function(event) {
         if (event.which == '13') {
            enviarMensaje();

        }
    });

  socket.on('newUser', function(nuevousuario){
    //avisamos que un nuevo usuario entro
     $("#chatlog").append('<b>Ha entrado al chat: ' + nuevousuario + '</b><br>');
    
  });
  socket.on('connect', function () {
    
    socket.emit("join room",sesion);
    if(sessionStorage.getItem("admin") != undefined){
      //si es administrador le mandamos al servidor su infomación y especificamos que es administrador
      socket.emit('NuevoUsuario',{usuario: sessionStorage.getItem("admin"), tipo: "admin"} );
    
    }
    if(sessionStorage.getItem("usuario") != undefined){
      //si el cliente es un usuario normal se lo mandamos al servidor y especificamos que es un usuario
      socket.emit('NuevoUsuario',{usuario: sessionStorage.getItem("usuario"), tipo: "usuario"} );
      
    }
    //comprobamos que haya menos de tres usuarios
    socket.emit('contador');
    
    //recibimos la confirmación de que hay un usuario de más
    socket.on('evitar conexion', function(ultimoUsuario){
    //revisamos que el cliente conectado sea el último que entro y no otro
    if(ultimoUsuario.usuario ==sessionStorage.getItem("usuario") ) {
    alert("Este Administrador esta atendiendo otra solicitud");
        control = false;
          window.location ="/usuario/listaAdmin";
    }

  });
    

      
    
  });
  

  //recibimos un mensaje y lo desplegamos
  socket.on('message', function(data) {
            $("#chatlog").append(data.usuario+': ' +data.mensaje);
        $("#chatlog").append("<br>");
  });
  
  function enviarMensaje() {
    var mensaje =$("#enviar").val();
    //nos aseguramos que estamos en la sala correcta
    socket.emit("join room",sesion);
    if(sessionStorage.getItem("admin") != undefined) {
      //si es administrador madamos su infomación y el mensaje
          socket.emit('message', {usuario: sessionStorage.getItem('admin'), mensaje: mensaje});
      
    } else {
      //si es usuario madamos su infomación y el mensaje
      socket.emit('message', {usuario: sessionStorage.getItem('usuario'), mensaje: mensaje});
      
    }
    $("#enviar").val('');

  }


}
function close() {
  if (sessionStorage.getItem("admin") != undefined) {
    
    //quitamos al administrador de la sala y del chat
    socket.emit("eliminar admin", sessionStorage.getItem("admin"));
    socket.emit("eliminar usuario", sessionStorage.getItem("admin"));
    socket.emit('message', {usuario : "Ha salido", mensaje:  sessionStorage.getItem("admin")});    
  }
  if (sessionStorage.getItem("usuario") != undefined) {
      //quitamos al usuario de la sala y del chat
      socket.emit("eliminar usuario", sessionStorage.getItem("usuario"))
      if(control == true) //este control es para que no mande este mensaje cuando un usuario extra quiera entrar
        socket.emit('message', {usuario : "Ha Salido", mensaje: sessionStorage.getItem("usuario")}); 
  }
}
$(document).on('ready', init);

$(window).on('beforeunload', close);