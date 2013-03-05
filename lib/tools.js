// some general purpose tools

var os = require('os');
var crc = require('crc');

var tools = module.exports;


tools.hex2num = function(hexString) {
    // do i want to chop off leading 0x bits?
    return parseInt(hexString, 16);
}

tools.num2hex = function(num) {
    return '0x'+num.toString(16);
}

tools.crcFromBuf = function(buf) {

    // from buffer
    var msgCRC = crc.buffer.crc16(buf);
    return msgCRC.toString(16);

    // //var str = "01 03 00 00 01";
    // // from string
    // return crc.crc16(str);

    // // from number
    // return crc.crc16(str);
}

tools.myIp = function() {

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

    // err, this is the first one!
    return addresses[0];
}
