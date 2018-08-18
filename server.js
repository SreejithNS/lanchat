//LanChat @TealDuck
//SERVER - 1.0.0

exports.lanchat = function(call){

var c = call;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require("ip");

var log = (data,name,left) =>{
  console.clear();
           //console.log('SERVER             : URL http://' + ip.address() + ':3000/');
           console.log("ActiveCli server.js: " + data.size);
  if(name) console.log("NewCli    server.js: " + name);
  if(left) console.log("LeftCli   server.js: " + left);
}

////////////////////////////////////  FILE SUPPLIERS ///////////////////////////////////////////


app.get('/socket.io/socket.io.js', function(req, res) {
   res.sendFile(__dirname+'/socket.io/socket.io.js');
});

app.get('/', function(req, res) {
   res.sendFile(__dirname+'/res/index.html');
});

app.get('/css', function(req, res) {
   res.sendFile(__dirname+'/res/css/index.css');
});

////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////  SERVER SOCKET ////////////////////////////////////////////

var connectedUserMap = new Map();

io.on('connection', function(socket) {

    let connectedUserId = socket.id;

    connectedUserMap.set(socket.id, { status:'online', name: 'none' });

    this.emit("online",connectedUserMap.size);

    log(connectedUserMap,false,false);

    socket.on('cli', function(data){
        let user = connectedUserMap.get(connectedUserId);
        user.name = data.name;
        log(connectedUserMap,user.name,false);
        socket.broadcast.emit('cliOnline',data.name);
    });

  	socket.on("msg",(data)=>{
  		io.emit("msg",(data));
  	});

  	socket.on("disconnect",()=>{
  		let user = connectedUserMap.get(connectedUserId);
      user.status = 'offline';
      connectedUserMap.delete(connectedUserId);
      log(connectedUserMap,false,user.name);
      socket.broadcast.emit("online",connectedUserMap.size);
  	})

});

////////////////////////////////////////////////////////////////////////////////////////////////


http.listen(3000, function() {
   console.log('Http      server.js: URL http://' + ip.address() + ':3000/');
   c();
});

}
