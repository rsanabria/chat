function init() {
  var serverBaseUrl = document.domain;

  /* 
   On client init, try to connect to the socket.IO server.
   Note we don't specify a port since we set up our server
   to run on port 8080
  */
  var socket = io.connect('http://localhost:3000');

  //We'll save our session ID in a variable for later
  var sessionId = '';

  /*
 When the client successfully connects to the server, an
 event "connect" is emitted. Let's get the session ID and
 log it.
  */
  socket.on('connect', function () {
    sessionId = socket.io.engine.id;
  });
            
function ingresar() {
    var usuario = $('#usuario').val();
  sessionStorage.setItem('usuario', usuario);
            window.location ="/chat/"+sessionId;
  //mandamos al Admin
  socket.emit("agregar admin",sessionId);
  }

$('#iniciar').on('click', ingresar);
  
}
$(document).on('ready', init);