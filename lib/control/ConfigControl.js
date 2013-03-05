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
    var self = this;

    self._socket.on('data', function(d){
        console.log('>>>',d)
    });

    self._socket.on('connect', function(d){
        console.log('connected');
    });

    self._socket.on('error', function(d){
        console.log('err >> ', d);
    });

    self._socket.connect(this._discoverport, this._wrcdip, function(){
        var tlCmd = self._cmdCreator.transmitterLogin();
        self.transmitterLoginSend(tlCmd);
    });
};

// TL
ConfigControl.prototype.transmitterLoginSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    console.log('tl', buf)
    var self = this;

    self._socket.write(buf, function(){
        console.log("tl cool");

        // chain up the next ommand
        var ccfgCmd = self._cmdCreator.channelConfig();
        self.channelConfigSend(ccfgCmd);
    });



};

//CCFG
ConfigControl.prototype.channelConfigSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    console.log('ccfg', buf);
    var self = this;

    self._socket.write(buf, function(){
        console.log("ccfg cool");
        var fcfgCmd = self._cmdCreator.failsafeConfig();
        self.failsafeConfigSend(fcfgCmd);
    });
}

//FCFG
ConfigControl.prototype.failsafeConfigSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    console.log('fsfg', buf);
    var self = this;

    self._socket.write(buf, function(){
        console.log("fsfg cool");
        // something else ... maybe? we should be done
    });
}

ConfigControl.prototype._connectSend = function(buf, cb) {
    var self = this;

    self._socket.connect(this._discoverport, this._wrcdip, function() {
        self._socket.write(buf, function(){
            console.log("cool");
            var ccfgCmd = this._cmdCreator.channelConfig();
            self.channelConfigSend(tlCmd);
        });
    });
}
