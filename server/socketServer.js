//Eventos Socket Io
var pg   = require('pg'),
    admins = [],
    usuarios=[], //incluidos admin
    sesionAdmin = [];
var room;

module.exports = function socket (io, conexionPostgres) {

  io.on('connection', function conexion(socket) {
    socket.on("join room", function(r) {
      //Recibe el identificador de sala para que se puedan crear multiples chats
      room = r;
      //con join nos unimos a la sala indicada
      socket.join(r);
    });
    
    socket.on('test', function(data) {
      console.log("prueba Servidor " + data);
       io.sockets.in(room).emit('rodrigo');
    });

    socket.on('NuevoUsuario', function(dataUsuario/*{usuario: usuario: tipo: tipo}*/) {
      //guardamos la infromacion del usuario
      usuarios.push(dataUsuario);
      //comprobamos que en la sala haya menos de 3 usuarios, si es así, se le manda al cliente el usuario
      if (  Object.keys(io.sockets.adapter.rooms[room]).length < 3) {
      io.sockets.in(room).emit('newUser', dataUsuario.usuario); 
      }
    })

    socket.on('agregar admin', function agregarAdmin(sesion, admin){
      //guarda al administrador
      admins.push(admin);
      //guarda el identificador de sala
      sesionAdmin.push(sesion);
      //manda al cliente las arreglos de salas y de administadores disponibles
      io.sockets.emit('resListarAdmins', sesionAdmin, admins);
    });

    socket.on("reqListarAdmins", function() {
    //enviamos la lista de administradores disponibles cuando entremos a /usuario/listaAdmin
      socket.emit('resListarAdmins', sesionAdmin, admins);
    });

    socket.on("eliminar admin", function(admin) {
      //eliminamos al administrador y a su sala de chat
      var index = admins.indexOf(admin);
      admins.splice(index,1);
      sesionAdmin.splice(index,1);
      //volvemos a enviar la información de los admin y sus identificadores de sala para actualizar la lista de disponibles
      io.sockets.emit('resListarAdmins', sesionAdmin, admins);
    });

    socket.on("eliminar usuario", function(usuario){
      
      //elimina al usuario del arreglo de usuarios
      for(var i=0; i < usuarios.length; i++) {
        if(usuarios[i].usuario == usuario ) {
          usuarios.splice(i,1);
        }
      }
    });

    socket.on('message', function enviarMensaje(mensaje) {
      //Manda el mensaje a la sala correspondiente
      io.sockets.in(room).emit('message',mensaje);
      //crea la conexión a postgres y guarda el mensaje si hay algun error se imprime en consola
        pg.connect(conexionPostgres, function(err, client, done) {
          if(err)
            return console.error('could not connect to postgres', err);
          var fecha = new Date();
          var fechaFormato = fecha.getDate() + "-" + (fecha.getMonth()+1) + "-" + fecha.getFullYear();
          var hora  =fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        client.query("INSERT INTO historial(chat,messages,fecha,hora,usuario) values($1, $2, $3, $4, $5)",[room,mensaje.mensaje,fechaFormato,hora,mensaje.usuario], function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }else {
            done();
          }	                    
        });
        });

    });

    socket.on('contador', function contar(){
     //Revisa el numero de usuarios conectadosen una sala especifica
      if (  Object.keys(io.sockets.adapter.rooms[room]).length > 2) {
        io.sockets.in(room).emit('evitar conexion',usuarios[usuarios.length-1]);
      }

    })
  });
}
