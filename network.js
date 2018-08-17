//LanChat network module

const EventEmitter = require('events');
var ev = new EventEmitter();
exports.network = ev;


var done = false;
var ip = false;


var evilscan = require('evilscan');

var options = {
    target:'192.168.1.0-192.168.1.253',
    port:'3000',
    status:'O', // Timeout, Refused, Open, Unreachable
    banner:true
};

var scanner = new evilscan(options);



scanner.on('result',function(data) {
    if(data.status == "open" || parseInt(data.port) == 3000) {ip = data.ip;}
});

scanner.on('error',function(err) {
    throw new Error(data.toString());
});

scanner.on('done',function() {
	ev.emit('netmod',ip);
});

scanner.run();


