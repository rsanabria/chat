var express     = require("express"),
    http        = require("http"),
    //socket      = require("socket.io"),
    bodyParser  = require("body-parser"),
    jade        = require("jade"),
    pg          = require('pg'),
    _           = require("underscore"),
    puerto      = 3000;


//BASE DE DATOS
var conexionPostgres = "postgres://postgres:postgres@localhost:5432/chat.messages";
var client = new pg.Client(conexionPostgres);
//Configuracion del Servidor

var app = express();

http = http.createServer(app);
//Io.JS
var io = require("socket.io").listen(http);
io.set('origins', '*:*');
  
//Server's port number 
//Especificar donde estan las vistas
app.set("views", __dirname + "/public/views");

//Activar jade
app.set("view engine", "jade");

//Especificar el contenido estatico
app.use(express.static("public", __dirname + "/public"));

//Soporte para peticiones tipo JSON
app.use(bodyParser.json());
//servidor http

//Eventos Socket Io
var admins = [],
    usuarios=[], //incluidos admin
    sesionAdmin = [];
var room;

io.on('connection', function conexion(socket) {
  socket.on("join room", function(r) {
    room = r;
    socket.join(r);
  });
  socket.on('test', function(data) {
    console.log("prueba Servidor " + data);
     io.sockets.in(room).emit('rodrigo');
  });
  
  socket.on('NuevoUsuario', function(dataUsuario) {
    usuarios.push(dataUsuario);
    if (  Object.keys(io.sockets.adapter.rooms[room]).length < 3) {
    io.sockets.in(room).emit('newUser', dataUsuario.usuario); 
    }
  })
  
  socket.on('agregar admin', function agregarAdmin(sesion, admin){
    admins.push(admin);
    sesionAdmin.push(sesion);
    io.sockets.emit('resListarAdmins', sesionAdmin, admins);
  });
  //enviamos la lista de administradores disponibles cuando entremos a /usuario/listaAdmin
  socket.on("reqListarAdmins", function() {
    //console.log(admins);
    socket.emit('resListarAdmins', sesionAdmin, admins);
  });
  
  socket.on("eliminar admin", function(admin) {
    var index = admins.indexOf(admin);
    admins.splice(index,1);
    sesionAdmin.splice(index,1);
    io.sockets.emit('resListarAdmins', sesionAdmin, admins);
  });
  
  socket.on("eliminar usuario", function(usuario){
    for(var i=0; i < usuarios.length; i++) {
      if(usuarios[i].usuario == usuario ) {
        usuarios.splice(i,1);
      }
    }
  });
   
  socket.on('message', function enviarMensaje(mensaje) {
    console.log(mensaje);
    io.sockets.in(room).emit('message',mensaje);
      client.connect(function(err) {
        if(err)
          return console.error('could not connect to postgres', err);
        var fecha = new Date();
	    var fechaFormato = fecha.getDate() + "-" + (fecha.getMonth()+1) + "-" + fecha.getFullYear();
        var hora  =fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
      client.query("INSERT INTO historial(chat,messages,fecha,hora,usuario) values($1, $2, $3, $4, $5)",[room,mensaje.mensaje,fechaFormato,hora,mensaje.usuario], function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }else {
          console.log(result);
          client.end();
        }	                    
      });
      });

  });

  socket.on('contador', function contar(){
    //console.log( Object.keys(io.sockets.adapter.rooms[room]).length);
    if (  Object.keys(io.sockets.adapter.rooms[room]).length > 2) {
      console.log(usuarios[usuarios.length-1]);
      io.sockets.in(room).emit('evitar conexion',usuarios[usuarios.length-1]);
    }
    
  })
});

//rutas
require('./server/routes/usuarioRoutes')(app, io);
require('./server/routes/chatRoutes')(app, io);
app.get('/', function(req, res) {
  res.render('inicio');
})

app.get('/admin', function (req, res) { 
  res.render("AdminInicio");

});




//Abrir el servidor
http.listen(puerto, function (){
  console.log("Servidor esuchando en el puerto: "+ puerto);
});

      
    
    