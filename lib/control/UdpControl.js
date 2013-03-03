var CommandCreator  = require('./CommandCreator');
var constants       = require('../constants');
var dgram           = require('dgram');

module.exports = UdpControl;

function UdpControl(options) {

    this._socket        = options.socket || dgram.createSocket('udp4');
    this._discoverport  = options.discoverport || constants.ports.DISCOVER;
    this._bindport      = options.bindport || constants.ports.BINDPORT;
    this._wrcdip        = options.wrcdip ||  constants.DEFAULT_CAR_IP;
    this._cmdCreator    = new CommandCreator();
    this._cmds          = [];

    // let's try and set up the car automatically for now
    this.setup();

}

UdpControl.prototype.setup = function() {
    var discoverCmd = this._cmdCreator.broadcastDiscover();

    this._socket.bind(this._bindport);

    // split out discover as it's a broadcast message
    this.discoverSend(discoverCmd);

    // other commands
    // this._cmds.push();
    // this.flush();
};



UdpControl.prototype.flush = function() {
    for (var i in this._cmds) {
        var cmd = constants.startFrame.concat(this._cmds[i]);
        var buf = new Buffer(cmd);

        this._socket.send(buf, 0, buf.length, this._port, this._wrcdip);
    }

    this._cmds = [];
};

UdpControl.prototype.discoverSend = function(cmd) {
    var cmd = constants.startFrame.concat(cmd);
    var buf = new Buffer(cmd);

    var self = this;

    self._socket.setBroadcast(true);
    self._socket.send(buf, 0, buf.length, this._discoverport, '255.255.255.255', function(err, bytes) {
        self._socket.close();
    });
    self._socket.setBroadcast(false);
};
