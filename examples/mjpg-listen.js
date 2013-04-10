var Buffer = require('buffer').Buffer;
var dgram = require('dgram');
var fs = require('fs');

// set up receiver
var log = require('sys').log;
var receivesock = dgram.createSocket("udp4", function(msg, rinfo){
    // log('got message ' + rinfo.address + ':' + rinfo.port);
    log('data ln: ' + rinfo.size + " data: "/* + msg.toString('hex')*/);

    log('version:');
    log(msg.readUInt32BE(0));

    log('frame num:');
    log(msg.readUInt32BE(4));

    log('offset:');
    log(msg.readUInt32BE(8));

    log('length:');
    log(msg.readUInt32BE(12));


    var fnum = msg.readUInt32BE(4);

    var f = fs.openSync('f' + fnum + '.jpg','w');

    fs.writeSync(f, msg, 16, msg.length - 16, 0);


});
receivesock.bind(34850);





