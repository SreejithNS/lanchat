//LanChat @TealDuck
//SERVER - 1.0.0

exports.lanchat = function(){
  
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require("ip");

var log = (data,new,left) =>{
  console.clear();
           console.log('SERVER        : URL http://' + ip.address() + ':3000/');
           console.log("Users Online  : " + data.size);
  if(name) console.log("New Users     : " + name);
  if(left) console.log("User Gone     : " + left);
}


app.get('/socket.io/socket.io.js', function(req, res) {
   res.sendFile(__dirname+'/socket.io/socket.io.js');
});

app.get('/', function(req, res) {
   res.sendFile(__dirname+'/index.html');
});

app.get('/toastjs', function(req, res) {
   res.sendFile(__dirname+'/node_modules/vanilla-toast/vanilla-toast.js');
});

app.get('/toastcss', function(req, res) {
   res.sendFile(__dirname+'/node_modules/vanilla-toast/vanilla-toast.css');
});

app.get('/css', function(req, res) {
   res.sendFile(__dirname+'/css/index.css');
});


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
console.log(connectedUserMap);

http.listen(3000, function() {
   console.log('SERVER       : URL http://' + ip.address() + ':3000/');
});

}
