var udp         = require('dgram');
var CarInfo     = require('./CarInfo');

Client.UdpControl = require('./control/UdpControl');

module.exports = Client;

function Client(options) {
    this.config = options.config
}

Client.prototype.resume = function() {

}
