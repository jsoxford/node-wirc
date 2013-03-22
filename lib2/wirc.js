var messages = require('./messages'),
    os = require('os'),
    dgram = require('dgram'),
    log = require('sys').log;


// get all addresses of the interfaces
var addresses = function(){
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family == 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses;
};





function WIRC (){

}





// Broadcast a discovery message, and wait for any
WIRC.prototype.discover = function(callback){
    var self = this;

    // listen for an answer
    this.discover_listen = dgram.createSocket("udp4", function(msg, rinfo){

        var m = new messages.BCSA(msg);

        // some time down the line - we'd want to
        // filter based on this
        self.serialNum = m.serialNum;
        
        self.address = rinfo.address;
        self.port = rinfo.port;

        self.discover_listen.close();
    });
    
    this.discover_listen.bind();
    var port = this.discover_listen.address().port;



    // send out the BCSD on all interfaces
    var bscd = new messages.BCSD();

    addresses().forEach(function(address){
        var send = dgram.createSocket("udp4");

        // send from our listener on an address
        send.bind(port, address);

        send.setBroadcast(true);

        send.send(bscd.b, 0, 9, 1984, "255.255.255.255", function(err, bytes){
            send.close();
        });

    });

};



var w = new WIRC();

w.discover();