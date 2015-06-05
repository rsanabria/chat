
function init() {
  
       $("form").submit( function(event) {
         event.preventDefault();
         iniciarSesion();

    });
  
  
  function iniciarSesion(){
    
    var usuario = $('#usuario').val();
    sessionStorage.setItem('usuario', usuario);
     window.location ="/usuario/listaAdmin";
    
  }
  
  $('#iniciar').on('click', iniciarSesion);

  
};
$(document).on('ready', init);