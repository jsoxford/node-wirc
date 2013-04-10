var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var CommandCreator  = require('./CommandCreator');
var constants       = require('../constants');
var dgram           = require('dgram');

module.exports = UdpControl;
util.inherits(UdpControl, EventEmitter);
function UdpControl(options) {
    this._socket        = options.socket || dgram.createSocket('udp4');
    this._discoverport  = options.discoverport || constants.ports.WRCDCONFPORT;
    this._bindport      = options.bindport || constants.ports.BINDPORT;
    this._wrcdip        = options.wrcdip ||  constants.DEFAULT_CAR_IP;
    this._cmdCreator    = new CommandCreator();
    this._cmds          = [];

    this._pcdValues     = options.pcdValues     || {};
    this._pcdRun        = options.pcdRun        || true; // default false?

}

UdpControl.prototype.setup = function() {
    var discoverCmd = this._cmdCreator.broadcastDiscover();

    this._socket.bind(this._bindport);

    // split out discover as it's a broadcast message
    this.discoverSend(discoverCmd);
};

UdpControl.prototype.updateOptions = function(options) {
    this._socket        = options.socket        || this._socket;
    this._discoverport  = options.discoverport  || this._discoverport;
    this._bindport      = options.bindport      || this._bindport;
    this._wrcdip        = options.wrcdip        || this._wrcdip;
    this._cmdCreator    = options.cmdCreator    || this._cmdCreator;
    this._cmds          = options._cmds         || this._cmds;

    this._pcdValues     = options.pcdValues     || {};
    this._pcdRun        = options.pcdRun        || true; // default false?
};

UdpControl.prototype.flush = function() {
    for (var i in this._cmds) {
        var cmd = constants.startFrame.concat(this._cmds[i]);
        var buf = new Buffer(cmd);

        this._socket.send(buf, 0, buf.length, this._port, this._wrcdip);
    }

    this._cmds = []; // do we even use this?

};

UdpControl.prototype.discoverSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);
    var buf = new Buffer(cmd);

    var self = this;

    // hmm, wonder if we should set up a new socket just for broadcast
    // seeing as we can't set broadcast to off straight away after as node won't
    // broadcast if we do.
    // we also need to send to the specifit broadcast ip of 255.255.255.255

    self._socket.setBroadcast(true);
    self._socket.send(buf, 0, buf.length, this._discoverport, "255.255.255.255", function(err, bytes) {
        self._socket.close();
    });

    // can't do this!
    //self._socket.setBroadcast(false);
};

UdpControl.prototype.pcdDo = function(values) {
    // /console.log('do')
    var sendValues = values || this._pcdValues;

    var cmd = this._cmdCreator.periodicChannelData(sendValues);
    this.periodicChannelDataSend(cmd);

    this._pcdTimeout(this.pcdDo, 10);
}

UdpControl.prototype._pcdTimeout = function(cb, interval) {
    if (this._pcdRun) {
        setTimeout(cb.bind(this), interval);    
    }
}

UdpControl.prototype.pcdUpdate = function(values) {

    if (values.drive >=0 || values.drive < 0) {
        this._pcdValues.drive = values.drive;
    }

    if (values.yaw >=0 || values.yaw < 0) {
        this._pcdValues.yaw = values.yaw;
    }

    var discoverCmd = this._cmdCreator.periodicChannelData(this._pcdValues);
}

UdpControl.prototype.periodicChannelDataSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);
    var buf = new Buffer(cmd);

    var self = this;
console.log('UdpControl.prototype.periodicChannelDataSend')
    self._socket.send(buf, 0, buf.length, this._discoverport, this._wrcdip, function(err, bytes) {
        //self._socket.close();
    });

};
