function init() {
  var serverBaseUrl = document.domain;

  /* 
   On client init, try to connect to the socket.IO server.
  */
  
     $("form").submit( function(event) {
                  event.preventDefault();
           ingresar();

    });
 
  var socket = io.connect('http://localhost:3000');

  //We'll save our session ID in a variable for later
  var sessionId = '';

  /*
 When the client successfully connects to the server, an
 event "connect" is emitted. Let's get the session ID and
 log it.
  */
  socket.on('connect', function () {
    //sacamos el identificador de sala
    sessionId = socket.io.engine.id;
  });
            
function ingresar() {
    var admin= $('#usuario').val();
  sessionStorage.setItem('admin', admin);
  //mandamos al Admin al servidor
  socket.emit("agregar admin",sessionId, admin);
   window.location ="/chat/"+sessionId;
  }


}
$(document).on('ready', init);