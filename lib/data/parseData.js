
var exports = module.exports = parseData;

function parseData(buffer) {
    console.log('parser')
    console.log(buffer);
}

//

// return PSD data object

    // --
    // var tools = require('../tools');
    // var log = require('sys').log;
    // var receivesock = dgram.createSocket("udp4", function(msg, rinfo){
    //     log('got message ' + rinfo.address + ':' + rinfo.port);
    //     log('data ln: ' + rinfo.size + " data: " + msg.toString('hex'))
    // });
    // receivesock.bind(this._bindport, "192.168.1.170");
    // --
