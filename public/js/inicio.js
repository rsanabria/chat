
function init() {
  function iniciarSesion(){
    var usuario = $('#usuario').val();
    console.log(usuario);
    sessionStorage.setItem('usuario', usuario);
     window.location ="/usuario/listaAdmin";
    
  }
  
  $('#iniciar').on('click', iniciarSesion);

  
};
$(document).on('ready', init);