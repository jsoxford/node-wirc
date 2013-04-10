var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var CommandCreator  = require('./CommandCreator');
var constants       = require('../constants');
var parseData       = require('../data/parseData');
var net             = require('net');

module.exports = ConfigControl;
util.inherits(ConfigControl, EventEmitter);
function ConfigControl(options) {

    this._socket        = options.socket || new net.Socket();
    this._parseData     = options.parseData || parseData; 
    this._discoverport  = options.discoverport || constants.ports.WRCDCONFPORT;
    this._bindport      = options.bindport || constants.ports.BINDPORT;
    this._wrcdip        = options.wrcdip ||  constants.DEFAULT_CAR_IP;
    this._cmdCreator    = new CommandCreator();
    this._cmds          = [];

}

ConfigControl.prototype.setup = function(callback) {
    var self = this;

    self._handleSetup();

    self._socket.connect(this._discoverport, this._wrcdip, function(){
        var tlCmd = self._cmdCreator.transmitterLogin();
        self.transmitterLoginSend(tlCmd);
    });
};

// TL
ConfigControl.prototype.transmitterLoginSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    //console.log('tl', buf)
    var self = this;

    self._socket.write(buf, function(){
        //console.log("tl cool");

        // chain up the next ommand
        var ccfgCmd = self._cmdCreator.channelConfig();
        self.channelConfigSend(ccfgCmd);
    });
};

//CCFG
ConfigControl.prototype.channelConfigSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    //console.log('ccfg', buf);
    var self = this;

    self._socket.write(buf, function(){
        //console.log("ccfg cool");
        var fcfgCmd = self._cmdCreator.failsafeConfig();
        self.failsafeConfigSend(fcfgCmd);
    });
}

//FCFG
ConfigControl.prototype.failsafeConfigSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    //console.log('fsfg', buf);
    var self = this;

    self._socket.write(buf, function(){
        //console.log("fsfg cool");
        // something else ... maybe? we should be done

        /*
        // Start the video feed, this needs
        // examples/mjpg-listen.js to be running

        setTimeout(function(){
            self.STSTSend();
        },1000);
        */
    });
}


//STST
ConfigControl.prototype.STSTSend = function() {

    // hard coded to port 34850
    var stst = [0x41, 0x03, 0, 0x88, 0x22];

    var cmd = this._cmdCreator.appendCrc(stst);

    cmd = constants.startFrame.concat(cmd);

    var buf = new Buffer(cmd);
    console.log('stst', buf);
    var self = this;

    self._socket.write(buf, function(){
        console.log("stst cool");
        // something else ... maybe? we should be done
    });
}

ConfigControl.prototype._connectSend = function(buf, cb) {
    var self = this;

    self._socket.connect(this._discoverport, this._wrcdip, function() {
        self._socket.write(buf, function(){
            //console.log("cool");
            var ccfgCmd = this._cmdCreator.channelConfig();
            self.channelConfigSend(tlCmd);
        });
    });
}

ConfigControl.prototype._handleSetup = function() {
    var self = this;

    self._socket.on('data', function(d){
        //console.log('CC data received')
        var msg = self._parseData(d);
        //console.log(typeof msg)
        if (typeof msg == 'object' && msg.cmd == 'WST') {
            console.log('emit')
            self.emit('transmitterState', msg);
        }
    });

    self._socket.on('connect', function(d){
        console.log('connected');
    });

    self._socket.on('error', function(d){
        var msg = self._parseData(d);

        if (msg.cmd == 'ERR') {
            self.emit('error', msg);
        } else {
            self.emit('error', d);    
        }
        
    });

}
