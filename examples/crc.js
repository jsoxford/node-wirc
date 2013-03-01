var crc = require('crc');
//console.log('cock')

var Buffer = require('buffer').Buffer;

var buf = new Buffer(5);
// buf = [ 0x01,                  // command
//         0x00,                  // uh, there was an extra NULL in the wiresharp dump, so...
//         0x1d,                  // protocol version (29)
//         this.name.length,      // username length
//         this.name,             // my username
//         0x00, 0x00, 0x00, 0x00, 0x00, 0x00    // unused
//     ];

//buf[0] ="0xAA";  // frame prefix
//buf[1] ="0xBB";  // frame prefix
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



var str = "01 03 00 00 01";
var num = 0103000001;
console.log(crc.crc16(str))
