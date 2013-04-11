// for reference. this script is self contained.
// it shows a basic receive server

var Buffer = require('buffer').Buffer;
var dgram = require('dgram');
var log = require('sys').log;

sock = dgram.createSocket("udp4", function(msg, rinfo){
    log('got message ' + rinfo.address + ':' + rinfo.port);
    log('data ln: ' + rinfo.size + " data: " + msg.toString('hex', 0, rinfo.size))
});

sock.bind(8000, '0.0.0.0');
