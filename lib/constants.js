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
