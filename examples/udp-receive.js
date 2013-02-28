var Buffer = require('buffer').Buffer;
var dgram = require('dgram');
var log = require('sys').log;

sock = dgram.createSocket("udp4", function(msg, rinfo){
    log('got message ' + rinfo.address + ':' + rinfo.port);
    log('data ln: ' + rinfo.size + " data: " + msg.toString('ascii', 0, rinfo.size))
});

sock.bind(8000, '0.0.0.0');