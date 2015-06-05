var express     = require("express"),
    http        = require("http"),
    //socket      = require("socket.io"),
    bodyParser  = require("body-parser"),
    jade        = require("jade"),
    _           = require("underscore"),
    puerto      = 3000;


//BASE DE DATOS
var conexionPostgres = "postgres://postgres:postgres@localhost:5432/chat.messages";
//var client = new pg.Client(conexionPostgres);
//Configuracion del Servidor

var app = express();

http = http.createServer(app);

  
//Especificar donde estan las vistas
app.set("views", __dirname + "/public/views");

//Activar jade
//app.set("view engine", "jade");

//Especificar el contenido estatico
app.use(express.static("public", __dirname + "/public"));

//Soporte para peticiones tipo JSON
app.use(bodyParser.json());

//SOCKET
var io = require("socket.io").listen(http); //Activar el socket en esta aplicacion
io.set('origins', '*:*');
require('./server/socketServer.js')(io, conexionPostgres); //cargar todas las funciones de comunicacion

//rutas
require('./server/routes/usuarioRoutes')(app);
require('./server/routes/chatRoutes')(app);




//Abrir el servidor
http.listen(puerto, function (){
  console.log("Servidor esuchando en el puerto: "+ puerto);
});

      
    
    