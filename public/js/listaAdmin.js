function init() {

  var socket = io.connect('http://localhost:3000');


  socket.on('connect', function () {
  });
      //pedir los admins
  socket.emit('reqListarAdmins');
  socket.on('resListarAdmins', function(sesiones, admins) {
    $("#admins").empty();
    for(var i= 0; i<admins.length;i++) {
      //listamos los administradores disponibles
      $("#admins").append('<td><span class="glyphicon glyphicon-user" aria-hidden="true"><a href="/chat/'+ sesiones[i] + '" >' +" "+ admins[i] +  '</a></span> </td>'  );
    }
    
  });
  
  

  
}
$(document).on('ready', init);