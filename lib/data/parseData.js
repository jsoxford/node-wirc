var constants = require('../constants');
var tools = require('../tools');

var exports = module.exports = parseData;

function parseData(buffer) {
    //console.log('parser')
    //console.log(buffer.toString('hex'));

    var cmdCode = buffer.slice(2,3).toString('hex');
    var msgLen = buffer.slice(3,4).toString('hex');

    if (cmdCode == constants.commands.BCSA.cmd) {
        exports.parsers.BCSA(buffer);
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
exports.parser.WST = function(buffer) {
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
exports.parser.AGR = function(buffer) {
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
exports.parser.PSD = function(buffer) {
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
exports.parser.TLST = function(buffer) {
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

exports.parser.TLEND = function(buffer) {
    var res = {cmd:'TLEND'};
    res.msgLen = 0;

    return res;
};

// TESTME
exports.parser.ERR = function(buffer) {
    var res = {cmd:'ERR'};
    res.msgLen = buffer.slice(3,4);

    // command code that produced the error
    res.cmdErr = buffer.slice(4,5);

    // error code
    res.errCode = buffer.slice(5,7);

    return res;
};
