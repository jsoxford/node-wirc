// for reference. this script is self contained.
// it shows the steps needed to send and recieve a discovery command

// get local ip address
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

var Buffer = require('buffer').Buffer;
var dgram = require('dgram');

// set up receiver
var log = require('sys').log;
var receivesock = dgram.createSocket("udp4", function(msg, rinfo){
    log('got message ' + rinfo.address + ':' + rinfo.port);
    log('data ln: ' + rinfo.size + " data: " + msg.toString('hex'));

    receivesock.close();
});
receivesock.bind();


var port = receivesock.address().port;

// set up sender
//
// The BCSD message is intended to be broadcasted
// Command Code (CMD):0x01
// Message Body Length (LEN): 3
// Fields in the message body:
//  1. [0] Sys (1 byte): Transmitter system type (0:PC client, 1: iPhone, 2: Android)
//  2. [1..2] Version (2 bytes): Version number of the transmitter first byte is the major version and the second is the minor version number.
// CRC
var buf = new Buffer(9);

buf[0] = 0xAA;  // frame prefix
buf[1] = 0xBB;  // frame prefix
buf[2] = 0x01;  // CMD
buf[3] = 0x03;  // LEN
buf[4] = 0x00;  // device type - PC
buf[5] = 0x00;  // version major
buf[6] = 0x01;  // version minor
buf[7] = 0x21;  // CRC = 33
buf[8] = 0xAC;  // CRC


// broadcast discovery message on an interface
function broadcast(address){
    console.log(address);
    var sendsock = dgram.createSocket("udp4");
    sendsock.bind(port,address);
    sendsock.setBroadcast(true);
    sendsock.send(buf, 0, 9, 1984, "255.255.255.255", function(err, bytes){
        sendsock.close();
    });
}

addresses.forEach(broadcast);
