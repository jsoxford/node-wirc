// constants for communicating and controlling the WiRC car
// based on http://www.wirc.dension.com/sites/default/files/downloads/WRC_Comm_Messages.pdf
var Buffer = require('buffer').Buffer;

var constants = module.exports;

constants.DEFAULT_CAR_IP = "192.168.1.1";

constants.ports = {
    WRCDCONFPORT: 1984,     // used for initial discovery
    BINDPORT    : 24454,    // we'll bind to this
    STATUSPORT  : 24455,    // for sending PSD messages
    MPEG        : 24456     // stream mpeg... if we ever get to that!!
};

constants.pcdValues = {
    min : 800,
    max : 2200
};

constants.device = {
    dtype   : 0, // PC
    svmaj   : 0, // version number major
    svmin   : 1  // version number minor
};

constants.startFrame = ['0xAA','0xBB'];

// cmd = command code
// len = message body length
constants.commands = {
    BCSD : {
        cmd : 1,    // 0x01
        len : 3     // 0x03
    },
    BCSA : {
        cmd : 2,    // 0x02
        len : 75    // 0x4B
    },
    TL : {
        cmd:  17,   // 0x11
        len : 70    // 0x46
    },
    DCFG : {
        cmd:  18,   // 0x12
        len : 68    // 0x44
    },
    CCFG : {
        cmd:  19,   // 0x13
        len : 24    // 0x18
    },
    FCFG : {
        cmd:  20,   // 0x14
        len : 24    // 0x18
    },
    WST : {
        cmd : 26,   // 0x1A
        len : 4     // 0x04
    },
    PCD : {
        cmd:  33,   // 0x21
        len : 24    // 0x18
    },
    PSD : {
        cmd : 34,   // 0x22
        len : 8     // 0x08
    },
    WCFG : {
        cmd:  49,   // 0x31
        len : 102   // 0x66
    },
    TLR : {
        cmd : 50,   // 0x32
        len : 0     // 0x00
    },
    TLST : {
        cmd:  51,   // 0x33
        len : 66    // 0x42
    },
    TLEND : {
        cmd : 52,   // 0x34
        len : 0     // 0x00
    },
    AREQ : {
        cmd : 53,   // 0x35
        len : 1     // 0x01
    },
    AGR : {
        cmd:  54,   // 0x36
        len : 67    // 0x43
    },
    FWUP : {
        cmd:  55,   // 0x37
        len : 16    // 0x10
    },
    STST : {
        cmd : 65,   // 0x41
        len : 3     // 0x03
    },
    EST : {
        cmd : 66,   // 0x42
        len : 1     // 0x01
    },
    ERR : {
        cmd : 255,  // 0xFF
        len : 3     // 0x03
    }
};
