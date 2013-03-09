var Stream      = require('stream').Stream;
var util        = require('util');
var dgram       = require('dgram');
var constants   = require('../constants');
var parseData   = require('./parseData');

module.exports = DataStream;
util.inherits(DataStream, Stream);
function DataStream(options) {
    Stream.call(this);

    options = options || {};

    this._socket      = options.socket || dgram.createSocket('udp4');
    this._bindport    = options.bindport || constants.ports.BINDPORT;
    this._wrcdip      = options.wrcdip ||  constants.DEFAULT_CAR_IP;
    this._parseData   = options.parser || parseData;

    // this.readable          = true;
    // this._initialized    = false;
    // this._timeout        = options.timeout || 100;
    // this._timer          = undefined;
    // this._sequenceNumber = 0;

}

DataStream.prototype.resume = function() {
    this._init();
};

DataStream.prototype._init = function() {
    this._socket.bind(this._bindport);
    this._socket.on('message', this._handleMessage.bind(this));
};

DataStream.prototype.destroy = function() {
    this._socket.close();
};

DataStream.prototype._handleMessage = function(buffer) {
    try {
        var navdata = this._parseData(buffer);
        console.log('navdata: ', navdata);
    } catch (err) {
        // avoid 'error' causing an exception when nobody is listening
        if (this.listeners('error').length > 0) {
            this.emit('error', err);
        }
        return;
    }

    //console.log(buffer);

    // Ignore out of order messages
    // if (navdata.sequenceNumber > this._sequenceNumber) {
    //   this._sequenceNumber = navdata.sequenceNumber;
    //   this.emit('data', navdata);
    // }

    // this._setTimeout();
};
