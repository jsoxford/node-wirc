
// hard coded
exports.BCSD = function (){

    this.b = new Buffer(9);

    this.b[0] = 0xAA;  // frame prefix
    this.b[1] = 0xBB;  // frame prefix
    this.b[2] = 0x01;  // CMD
    this.b[3] = 0x03;  // LEN
    this.b[4] = 0x00;  // device type - PC
    this.b[5] = 0x00;  // version major
    this.b[6] = 0x01;  // version minor
    this.b[7] = 0x21;  // CRC = 33
    this.b[8] = 0xAC;  // CRC

};



// parse
exports.BCSA = function(buffer){

    this.cmd = 'BCSA';

    this.msgLen = buffer.toString('hex',3,4);

    // msg split
    //  4,6 - HW ver
    this.hardwareVersion = buffer.toString('hex',4,6);

    //  6,8 - SW ver
    this.softwareVersion = buffer.toString('hex',6,8);

    //  8, length-9 - WRC name
    //  -9: 7 for field length, 2 for crc
    this.wrcName = buffer.toString('utf8',8, buffer.length-9);

    //  length-9,length - serial
    this.serialNum = buffer.toString('utf8', buffer.length-9,buffer.length);

};