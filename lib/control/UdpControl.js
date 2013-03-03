var CommandCreator  = require('./CommandCreator');
var constants       = require('../constants');
var dgram           = require('dgram');

module.exports = UdpControl;

function UdpControl(options) {

    this._socket        = options.socket || dgram.createSocket('udp4');
    this._port          = options.port || constants.ports.DISCOVER;
    this._ip            = options.ip ||  constants.DEFAULT_CAR_IP;
    this._cmdCreator    = new CommandCreator();
    this._cmds          = [];

    // let's try and set up the car automatically for now
    this.setup();

}

UdpControl.prototype.setup = function() {
    var discoverCmd = this._cmdCreator.broadcastDiscover();

    this._cmds.push(discoverCmd);

    this.flush();
};

UdpControl.prototype.flush = function() {
    for (var i in this._cmds) {
        var cmd = constants.startFrame.concat(this._cmds[i]);
        var buf = new Buffer(cmd);

        this._socket.send(buf, 0, buf.length, this._port, this._ip);
    }

    this._cmds = [];
}
