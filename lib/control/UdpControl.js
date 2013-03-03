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

    // --
    // var tools = require('../tools');
    // var log = require('sys').log;
    // var receivesock = dgram.createSocket("udp4", function(msg, rinfo){
    //     log('got message ' + rinfo.address + ':' + rinfo.port);
    //     log('data ln: ' + rinfo.size + " data: " + msg.toString('hex'))
    // });
    // receivesock.bind(this._bindport, "192.168.1.170");
    // --

    // hmm, wonder if we should set up a new socket just for broadcast
    // seeing as we can't set broadcast to off straight away after as node won't
    // boradcast if we do.
    // we also need to send to the specifit broadcast ip of 255.255.255.255

    self._socket.setBroadcast(true);
    self._socket.send(buf, 0, buf.length, this._discoverport, "255.255.255.255", function(err, bytes) {
        self._socket.close();
    });

    // can't do this!
    //self._socket.setBroadcast(false);
};
