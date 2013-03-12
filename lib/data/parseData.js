var constants = require('../constants');
var tools = require('../tools');

var exports = module.exports = parseData;

function parseData(buffer) {
    //console.log('parsers')
    //console.log(buffer.toString('hex'));

    var cmdCode = '0x'+buffer.slice(2,3).toString('hex');
    var msgLen = '0x'+buffer.slice(3,4).toString('hex');

    if (cmdCode == constants.commands.BCSA.cmd) {
        return exports.parsers.BCSA(buffer);
    }

    if (cmdCode == constants.commands.WST.cmd) {
        return exports.parsers.WST(buffer);
    }

    if (cmdCode == constants.commands.AGR.cmd) {
        return exports.parsers.AGR(buffer);
    }

    if (cmdCode == constants.commands.PSD.cmd) {
        return exports.parsers.PSD(buffer);
    }

    if (cmdCode == constants.commands.TLST.cmd) {
        return exports.parsers.TLST(buffer);
    }

    if (cmdCode == constants.commands.TLEND.cmd) {
        return exports.parsers.TLEND(buffer);
    }

    if (cmdCode == constants.commands.ERR.cmd) {
        return exports.parsers.ERR(buffer);
    }
}

exports.parsers = {};

exports.parsers.BCSA = function(buffer) {
    var res = {cmd:'BCSA'};

    res.msgLen = buffer.slice(3,4).toString('hex');

    // msg split
    //  4,6 - HW ver
    res.hardwareVersion = buffer.slice(4,6).toString('hex');
    //console.log('hw version', hwVer); // does anyone really care about this?

    //  6,8 - SW ver
    res.softwareVersion = buffer.slice(6,8).toString('hex');
    //console.log('sw version', swVer); // honestly, who cares?

    //  8, length-9 - WRC name
    //  -9: 7 for field length, 2 for crc
    res.wrcName = buffer.slice(8,buffer.length-9).toString('ascii');
    //console.log('car name', wrcName);

    //  length-9,length - serial
    res.serialNum = buffer.slice(buffer.length-9,buffer.length).toString('ascii');
    //console.log('serial number', serialNum);

    return res;
};

// TESTME
exports.parsers.WST = function(buffer) {
    var res = {cmd:'WST'};

    res.msgLen = buffer.slice(3,4);

    // ID - transmitter id
    res.transmitterId = buffer.slice(4,5);
    
    // CN - number of connected cameras
    res.numberOfCameras = buffer.slice(5,6); 
    
    // PORT - control port - to send PCD messages
    res.controlPort = buffer.slice(6,8);

    return res;
};

// TESTME
exports.parsers.AGR = function(buffer) {
    var res = {cmd:'AGR'};
    
    res.msgLen = buffer.slice(3,4);

    // ID - transmitter id
    res.transmitterId = buffer.slice(4,5);

    // Prio - priority of transmitter
    res.priority = buffer.slice(5,6); 
    
    // Transmitter name (64 bytes) 
    res.transmitterName = buffer.slice(6, buffer.length-3).toString('ascii');
    
    // Control notification: 0 granted, 1 denied requested, 2 access lost, 3 granted to everyone
    res.controlGrant = buffer.slice(buffer.length-3, buffer.length-2);

    return res;
};

// TESTME
exports.parsers.PSD = function(buffer) {
    var res = {cmd:'PSD'};

    res.msgLen = buffer.slice(3,4);

    // Batt 1 - battery voltage, integer value in millivolts
    res.battery1 = buffer.slice(4,6);

    // Batt 2 - analogue input voltage, integer value in millivolts . 
    res.battery2 = buffer.slice(6,8);

    // IN 1 - state of digital input 1
    res.digitalIn1 = buffer.slice(8,9);

    // IN 2 
    res.digitalIn2 = buffer.slice(9,10);

    // IN 3 
    res.digitalIn3 = buffer.slice(10,11);

    // IN 4
    res.digitalIn4 = buffer.slice(11,12);

    return res;

};

// TESTME
exports.parsers.TLST = function(buffer) {
    var res = {cmd:'TLST'};
    res.msgLen = buffer.slice(3,4);

    // ID - transmitter id
    res.transmitterId = buffer.slice(4,5);

    // Prio - priority of transmitter
    res.priority = buffer.slice(5,6); 
    
    // Transmitter name (64 bytes) 
    res.transmitterName = buffer.slice(6, buffer.length-2).toString('ascii'); 

    return res;
};

exports.parsers.TLEND = function(buffer) {
    var res = {cmd:'TLEND'};
    res.msgLen = 0;

    return res;
};

// TESTME
exports.parsers.ERR = function(buffer) {
    var res = {cmd:'ERR'};
    res.msgLen = buffer.slice(3,4);

    // command code that produced the error
    res.cmdErr = buffer.slice(4,5);

    // error code
    res.errCode = buffer.slice(5,7);

    res.errMsg = (function(i){
        var err = [
            {errType:'MSG_ERR_NONE',errMessage: 'No error'},
            {errType:'MSG_ERR_FORMAT',errMessage: 'Message format error (i.e. invalid value or invalid length)'},
            {errType:'MSG_ERR_DENIED',errMessage: 'Permission denied!'},
            {errType:'MSG_ERR_SYS',errMessage: 'General system error in WRC mechanism'},
            {errType:'MSG_ERR_SAVE',errMessage: 'Unable to save actual configuration'},
            {errType:'MSG_ERR_UNAUTH',errMessage: 'Unauthorized connection'},
            {errType:'MSG_ERR_BUSY',errMessage: 'IP address is busy'}]; 
        return err[i];
    })(res.errCode);

    // #define MSG_ERR_NONE        0x0000      /* No error */
    // #define MSG_ERR_FORMAT      0x0001      /* Message fomat error (i.e. invalid value or invalid length) */
    // #define MSG_ERR_DENIED      0x0002      /* Permission denied! */
    // #define MSG_ERR_SYS         0x0003      /* General system error in WRC mechanism */
    // #define MSG_ERR_SAVE        0x0004      /* Unable to save actual configuration */
    // #define MSG_ERR_UNAUTH      0x0005      /* Unauthorized connection */
    // #define MSG_ERR_BUSY        0x0006      /* IP address is busy */

    return res;
};
