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

    msg[0] = bcsd.cmd;
    msg[1] = bcsd.len;
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

    msg[0] = tl.cmd;
    msg[1] = tl.len;
    msg[2] = constants.device.dtype;  // device type - PC
    msg[3] = constants.device.svmaj;  // version major
    msg[4] = constants.device.svmin;  // version minor
    msg[5] = 255; // priority - highest

    var str = 'node wirc';
    for (var i = 0; i < 64 ; i++) {
        msg.push(str[i] ? str.charCodeAt(i) : 0);
    }

    // This needs to be split into bytes
    //msg.push(constants.ports.STATUSPORT); (24455)
    // This is for the port for the car to send PSD messages to
    msg.push(0x5f);
    msg.push(0x87);

    msg = this.appendCrc(msg);

    return msg;
};

CommandCreator.prototype.deviceConfig = function(options) {
    // TODO
};

CommandCreator.prototype.channelConfig = function(options) {
    // set the time periond of the generated pulses on PCD channel outputs.
    // timeperiod is between 5ms and 20ms, so value is between 5000 and 20000.
    // data is in 16bit, so we'll split on values

    var crc     = 0,
        msg     = [];
    var ccfg    = constants.commands.CCFG;

    msg[0] = 0x13;
    msg[1] = 0x18;

    var timePeriod = 20000; // expect we'll want this num for a timeout somewhere

    //4e20


    for (var i = 2;i<26;i=i+2) {
        msg[i] = '0x17';
        msg[i+1] = '0x70';
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

    for (var i = 0; i < 12; i++) {
        // msg.push(0x05);
        // msg.push(0xdc);
        msg.push(0x00);
        msg.push(0x00);
    }

    msg = this.appendCrc(msg);

    //console.log('fcfg', msg);

    return msg;
};

CommandCreator.prototype.periodicChannelData = function(value) {
    var crc     = 0,
        msg     = [];
    var pcd    = constants.commands.PCD;

    msg[0] = pcd.cmd;
    msg[1] = pcd.len;
    for (var i = 0; i < 12; i ++) {
        msg.push(6);
        msg.push(value);
    }

    msg = this.appendCrc(msg);

    return msg;
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
    //msg = msg.concat([tools.hex2num(crc.substr(0,2)), tools.hex2num(crc.substr(2,4))]);

    // Adds leading zeroes to the string
    while (crc.length < 4) crc = "0" + crc;

    msg = msg.concat(['0x'+crc.substr(0,2), '0x'+crc.substr(2,4)]);

    return msg;
};
