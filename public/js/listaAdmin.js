function init() {

  /* 
   On client init, try to connect to the socket.IO server.
   Note we don't specify a port since we set up our server
   to run on port 8080
  */
  var socket = io.connect('http://localhost:3000');

  //We'll save our session ID in a variable for later

  /*
 When the client successfully connects to the server, an
 event "connect" is emitted. Let's get the session ID and
 log it.
  */
  socket.on('connect', function () {
    //pedir los admins
    //socket.emit('reqListarAdmins');

  });
  socket.emit('reqListarAdmins');
  socket.on('resListarAdmins', function(sesiones, admins) {
    console.log(admins);
    $("#admins").empty();
    for(var i= 0; i<admins.length;i++) {
      $("#admins").append('<td><span class="glyphicon glyphicon-user" aria-hidden="true"><a href="/chat/'+ sesiones[i] + '" >' +" "+ admins[i] +  '</a></span> </td>'  );
    }
    
  });
  
  

  
}
$(document).on('ready', init);