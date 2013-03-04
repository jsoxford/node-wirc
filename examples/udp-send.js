// for reference. this script is self contained.
// it shows a basic sending.

var Buffer = require('buffer').Buffer;
var dgram = require('dgram');

var sock = dgram.createSocket("udp4");

var buf = new Buffer(256);

buf[0] = 33;
buf[1] = "0x18";
buf[3] = "0x708";
buf[4] = "0x708";
buf[5] = "0x00";
buf[6] = "0x00";
buf[7] = "0x00";
buf[8] = "0x00";
buf[9] = "0x00";
buf[10] = "0x00";
buf[11] = "0x00";
buf[12] = "0x00";
buf[13] = "0x00";
buf[14] = "0x00";
//127.0.0.1

sock.send(buf, 0, buf.length, 8000, "192.168.1.1", function(err, bytes){
    sock.close();
});
