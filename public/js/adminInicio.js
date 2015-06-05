function init() {
  var serverBaseUrl = document.domain;

  
     $("form").submit( function(event) {
                  event.preventDefault();
           ingresar();

    });
 
  var socket = io.connect('http://localhost:3000');

  var sessionId = '';

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