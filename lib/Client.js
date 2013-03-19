var EventEmitter = require('events').EventEmitter;
var util         = require('util');

Client.UdpControl       = require('./control/UdpControl');
Client.ConfigControl    = require('./control/ConfigControl');
Client.DataStream       = require('./data/DataStream');

module.exports = Client;
util.inherits(Client, EventEmitter);
function Client(options) {
    options = options || {};

    this.config = options.config || {};

    this._udpControl    = options.udpControl || new Client.UdpControl(options);
    this._configControl = options.configControl || new Client.ConfigControl(options);
    this._dataStream    = options.dataStream || new Client.DataStream(options);
    this._afterOffset   = 0;
    this._interval      = null;
}

Client.prototype.createClient = function() {
    // TODO
};

Client.prototype.resume = function() {

    var self = this;
    this._dataStream.removeAllListeners();
    this._dataStream.resume();

    // let's try and set up the car automatically for now
    // FIXME these two are running out of order
    //this._udpControl.setup();
    this._configControl.setup();

    this._configControl.on('transmitterState', function(msg){
        console.log('tst')
        if (msg.cmd == 'WST') {
            //console.log('control port: ', msg.controlPort);
            self._udpControl.updateOptions({discoverport: msg.controlPort});

            // and begin firing pcd commands
            self._udpControl.pcdDo();

            self.returnMe();
        }

    });

    return this;

};

Client.prototype.returnMe = function(){
    return this;
}

Client.prototype.after = function(duration, fn) {
    setTimeout(fn.bind(this), this._afterOffset + duration);
    this._afterOffset += duration;
    return this;
}

Client.prototype.finish = function() {
    this._dataStream.destroy();
}

Client.prototype.config = function() {
    // TODO
};

// motor
Client.prototype.forward = function(speed) {
    console.log('forward');
    this._udpControl.pcdUpdate({drive:speed});
};

Client.prototype.backward = function(speed) {
    console.log('backward');
    this._udpControl.pcdUpdate({drive:-speed});
};

Client.prototype.stop = function() {
    // TODO
};

// steering
// using the more abstract term yaw for now as "i haz no know angles"
Client.prototype.left = function(yaw) {
    console.log('left');
    this._udpControl.pcdUpdate({yaw:-yaw});
};

Client.prototype.right = function(yaw) {
    console.log('right');
    this._udpControl.pcdUpdate({yaw:yaw});
};

Client.prototype.straight = function() {
    // TODO
};


// perform sequence of commands
// each one will continue until a new action is received or duration expires
Client.prototype.sequence = function(action, duration) {
    // TODO
};

Client.prototype._setInterval = function(duration) {
  clearInterval(this._interval);
  this._interval = setInterval(this._sendCommands.bind(this), duration);
};

Client.prototype._sendCommands = function() {


    var cmd = udp._cmdCreator.periodicChannelData(value);
    this._udpControl.periodicChannelDataSend(this._pcmd);
  //this._udpControl.flush();
};