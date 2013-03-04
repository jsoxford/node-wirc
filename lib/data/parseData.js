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

exports.parsers = {}

exports.parsers.BCSA = function(buffer) {

    var msgLen = buffer.slice(3,4).toString('hex');

    // msg split
    //  4,6 - HW ver
    var hwVer = buffer.slice(4,6).toString('hex');
    console.log('hw version', hwVer); // does anyone really care about this?

    //  6,8 - SW ver
    var swVer = buffer.slice(6,8).toString('hex');
    console.log('sw version', swVer); // honestly, who cares?

    //  8, length-9 - WRC name
    //  -9: 7 for field length, 2 for crc
    var wrcName = buffer.slice(8,buffer.length-9).toString('ascii');
    console.log('car name', wrcName);

    //  length-9,length - serial
    var serialNum = buffer.slice(buffer.length-9,buffer.length).toString('ascii');
    console.log('serial number', serialNum);

    // example buffer string
    // "aabb024b0104010444656e73696f6e2057695243004445560000000000000000000000000000000000000000000000000000000000000000000100000050fd7fbd0200000009000030303030393434ef7d"


};


