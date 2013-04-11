// for reference. this script is self contained.
// it is for playing with different ways to make the crc

var crc     = require('crc');
var tools   = require('../lib/tools');
var Buffer  = require('buffer').Buffer;

var buf = new Buffer(5);

//buf[0] ="0xAA";  // frame prefix - not included in crc
//buf[1] ="0xBB";  // frame prefix - not included in crc
buf[0] = "0x01";  // CMD
buf[1] = "0x03";  // LEN
buf[2] = "0x00";  // device type - PC
buf[3] = "0x00";  // version major
buf[4] = "0x01";  // version minor

// var str = 0;
// for (b in buf) {
//     console.log(b)
//     console.log('int: '+parseInt(b, 16));
//     str += parseInt(b, 16)
// }

// console.log(str);

//buf[7] ="0x21";  // CRC
//buf[8] ="0xAC";  // CRC

var msgCRC = crc.buffer.crc16(buf);

console.log(msgCRC.toString(16));

console.log(msgCRC)

// not got any of this to work yet.
// only the buffer version above works
var str = "0x01 0x03 0x00 0x00 0x01";
var num = 0103000001;
var arr = [01,03,00,00,01];
var altstr = "1 3 0 0 1";
var shortNum = "131";
console.log(crc.crc16(altstr))
