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
    var result  = {};

    msg[0] = tools.num2hex(bcsd.cmd);
    msg[1] = tools.num2hex(bcsd.len);
    msg[2] = 0;  // device type - PC
    msg[3] = 0;  // version major
    msg[4] = 1;  // version minor

    msg = appendCrc(msg);

    return msg;
};

CommandCreator.prototype.transmitterLogin = function(options) {
    // TODO
};

CommandCreator.prototype.deviceConfig = function(options) {
    // TODO
};

CommandCreator.prototype.channelConfig = function(options) {
    // TODO
};

CommandCreator.prototype.failsafeConfig = function(options) {
    // TODO
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

var appendCrc = function (msg) {
    // we turn msg in to a buffer just to get the crc.
    // crc from array would be nicer... let's call that a TODO!
    var msgBuf = new Buffer(msg);
    crc = tools.crcFromBuf(msgBuf);

    // then chop up the crc and add it to the msg
    msg = msg.concat([tools.hex2num(crc.substr(0,2)), tools.hex2num(crc.substr(2,4))]);

    return msg;
};
