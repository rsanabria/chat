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
    socket.emit('reqListarAdmins');

  });
  socket.on('resListarAdmins', function(admins) {
    
    admins.forEach(function(admin) {
       $("#admins").append('<a href="/chat/'+ admin + '" >' + admin +  '</a>' );
    })
    
  });
  
  

  
}
$(document).on('ready', init);