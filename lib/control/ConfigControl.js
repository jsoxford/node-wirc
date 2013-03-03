// we have to do some TCP control and config.
//  might be better to split it out to this
var CommandCreator  = require('./CommandCreator');
var constants       = require('../constants');
var net             = require('net');

module.exports = ConfigControl;

function ConfigControl(options) {

    this._socket        = options.socket || new net.Socket();
    this._discoverport  = options.discoverport || constants.ports.WRCDCONFPORT;
    this._bindport      = options.bindport || constants.ports.BINDPORT;
    this._wrcdip        = options.wrcdip ||  constants.DEFAULT_CAR_IP;
    this._cmdCreator    = new CommandCreator();
    this._cmds          = [];

}

ConfigControl.prototype.setup = function() {

    var tlCmd = this._cmdCreator.transmitterLogin();

    this.transmitterLoginSend(tlCmd);

};

ConfigControl.prototype.transmitterLoginSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    // well, this is a pretty contrived way to get a buffer
    //  with a padded message in the middle
    var prePad = new Buffer(cmd.slice(0,8))
    var postPad = new Buffer(cmd.slice(9,cmd.length))
    var buf = new Buffer.concat([prePad, cmd[8], postPad]);

    var self = this;

    self._socket.connect(this._discoverport, this._wrcdip, function() {
        self._socket.write(buf);
    });

};

//CCFG
//FCFG
//WRCD
