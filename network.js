//LanChat network module

exports.network = function() {

var evilscan = require('evilscan');

var ip = false;

var options = {
    target:'192.168.1.0-192.168.1.255',
    port:'3000',
    status:'TROU', // Timeout, Refused, Open, Unreachable
    banner:true
};

var scanner = new evilscan(options);

scanner.on('result',function(data) {
    if(data.status == 'open') {ip = data.ip};
});

scanner.on('error',function(err) {
    throw new Error(data.toString());
});

scanner.on('done',function() {
  return ip;
});

scanner.run();

}
