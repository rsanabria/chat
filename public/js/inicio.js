function init() {
  //var socket = io.connect('http://localhost:3000/');
  function iniciarSesion(){
    
    var usuario = prompt('Escribe un nombre de usuario');
    sessionStorage.setItem('usuario', usuario);
     window.location ="/usuario/listaAdmin"
    
  }
  
  $('#iniciar').on('click', iniciarSesion);

  
};
$(document).on('ready', init);