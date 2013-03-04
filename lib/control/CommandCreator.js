// builds commands and returns them, normally as buffers

var Buffer      = require('buffer').Buffer;
var constants   = require('../constants');
var tools       = require('../tools');

var exports = module.exports = CommandCreator;

function CommandCreator() {

}

CommandCreator.prototype.broadcastDiscover = function() {
    var crc     = 0,
        msg     = [];
    var bcsd    = constants.commands.BCSD;

    msg[0] = tools.num2hex(bcsd.cmd);
    msg[1] = tools.num2hex(bcsd.len);
    msg[2] = constants.device.dtype;  // device type - PC
    msg[3] = constants.device.svmaj;  // version major
    msg[4] = constants.device.svmin;  // version minor

    msg = this.appendCrc(msg);

    return msg;
};

CommandCreator.prototype.transmitterLogin = function(options) {
    var crc     = 0,
        msg     = [];
    var tl      = constants.commands.TL;

    msg[0] = tools.num2hex(tl.cmd);
    msg[1] = tools.num2hex(tl.len);
    msg[2] = constants.device.dtype;  // device type - PC
    msg[3] = constants.device.svmaj;  // version major
    msg[4] = constants.device.svmin;  // version minor
    msg[5] = 255; // priority - highest

    var paddedBuf = new Buffer(64)
    paddedBuf.write('node wirc', 0, 64, 'ascii')

    msg[6] = paddedBuf; // device name - errr, do we need to pad out here?

    msg[7] = constants.ports.STATUSPORT;

    msg = this.appendCrc(msg);

    return msg;
};

CommandCreator.prototype.deviceConfig = function(options) {
    // TODO
};

CommandCreator.prototype.channelConfig = function(options) {
    // set the time periond of the generated pulses on channel outputs.
    // timeperiod is between 5ms and 20ms, so value is between 5000 and 20000.
    // data is in 16bit, so we'll split on values 
    
    var crc     = 0,
        msg     = [];
    var ccfg    = constants.commands.CCFG;

    msg[0] = "0x13";
    msg[1] = "0x18";

    var timePeriod = 20000; // expect we'll want this num for a timeout somewhere 

    //4e20


    for (var i = 2;i<26;i=i+2) {
        msg[i] = '0x4e';
        msg[i+1] = '0x20';
    }

    msg = this.appendCrc(msg);

    //console.log('ccfg', msg);

    return msg;
};

CommandCreator.prototype.failsafeConfig = function(options) {
    var crc     = 0,
        msg     = [];
    var fcfg    = constants.commands.FCFG;

    msg[0] = "0x14"; // not sure why fcfg.cmd isn't working. that needs resolving
    msg[1] = "0x18";

    var failsafeVolt = 1506; // expect we'll want keep this too 
    // 05e2

    for (var i = 2;i<26;i=i+2) {
        msg[i] = '0x05';
        msg[i+1] = '0xe2';
    }

    //msg = this.appendCrc(msg);

    //console.log('fcfg', msg);

    return msg;
};

CommandCreator.prototype.periodicChannelData = function(options) {
    // TODO
};

CommandCreator.prototype.transmitterListRequest = function() {
    // TODO
};

// Other commands TODO
// - wifi config
// - access request
// - start stream
// - end stream

CommandCreator.prototype.appendCrc = function (msg) {
    // we turn msg in to a buffer just to get the crc.
    // crc from array would be nicer... let's call that a TODO!
    var msgBuf = new Buffer(msg);
    crc = tools.crcFromBuf(msgBuf);

    // then chop up the crc and add it to the msg
    msg = msg.concat([tools.hex2num(crc.substr(0,2)), tools.hex2num(crc.substr(2,4))]);

    return msg;
};
