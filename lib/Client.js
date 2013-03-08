//var EventEmitter = require('events').EventEmitter;

Client.UdpControl       = require('./control/UdpControl');
Client.ConfigControl    = require('./control/ConfigControl');
Client.DataStream       = require('./data/DataStream');

module.exports = Client;

function Client(options) {
    options = options || {};

    this.config = options.config || {};

    this._udpControl = options.udpControl || new Client.UdpControl(options);
    this._configControl = options.configControl || new Client.ConfigControl(options);
    this._dataStream = options.dataStream || new Client.DataStream(options);
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
    this._configControl.setup(function(port) {

        var count = 0;

        setInterval(function() {
            if (count < 150 * 6) {
                var udp = new Client.UdpControl({discoverport: port});
                value = parseInt((count/5) % 150);
                console.log(value);
                var cmd = udp._cmdCreator.periodicChannelData(value);
                udp.periodicChannelDataSend(cmd);
            }
            count++;
        }, 10);

    });
};

Client.prototype.finish = function() {
    this._dataStream.destroy();
}

Client.prototype.config = function() {
    // TODO
};

// motor
Client.prototype.forward = function(speed) {
    // TODO
};

Client.prototype.backward = function(speed) {
    // TODO
};

Client.prototype.stop = function() {
    // TODO
};

// steering
// using the more abstract term yaw for now as "i haz no know angles"
Client.prototype.left = function(yaw) {
    // TODO
};

Client.prototype.right = function(yaw) {
    // TODO
};

Client.prototype.straight = function() {
    // TODO
};


// perform sequence of commands
// these should use pubsub events,
//    each one will continue until a new action is received or duration expires
Client.prototype.sequence = function(action, duration) {
    // TODO
};
