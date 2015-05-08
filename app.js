var express     = require("express"),
    http        = require("http"),
    //socket      = require("socket.io"),
    bodyParser  = require("body-parser"),
    jade        = require("jade"),
    _           = require("underscore"),
    puerto      = 3000;


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
var admins = []; 
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
  
  socket.on('agregar admin', function agregarAdmin(usuario){
    admins.push(usuario);
  })
  //enviamos la lista de administradores disponibles cuando entremos a /usuario/listaAdmin
  socket.on("reqListarAdmins", function() {
    
    socket.emit('resListarAdmins', admins);
  });
  
  
  socket.on('newUser', function newUser() {
    console.log("Conexion");
    //participantes.push({"usuario" : data.usuario});
  });
  
  socket.on('message', function enviarMensaje(mensaje) {
    console.log(mensaje);
    io.sockets.in(room).emit('message',mensaje);
  });

  socket.on('contador', function contar(){
    console.log( Object.keys(io.sockets.adapter.rooms[room]).length);
    if (  Object.keys(io.sockets.adapter.rooms[room]).length > 2) {
      io.sockets.in(room).emit('evitar conexion');
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

      
    
    