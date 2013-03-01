// constants for communicating and controlling the WiRC car
// based on http://www.wirc.dension.com/sites/default/files/downloads/WRC_Comm_Messages.pdf

var constants = module.exports;

var buildMessage = function(cmd, msg) {

}

var lenForCmd = function(cmd) {

    var len = 0;

    if (typeof cmd === 'string') {
        cmd = hex2num(cmd);
    }

    return len;
}

var hex2num = function(hexString) {


    // do i want to chop off leading 0x bits?
    return parseInt(hexString, 16);

}

var num2hex = function(num) {
    return num.toString(16);
}

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
        len : 8     //0x08
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
        len : 3     //0x03
    }
};
