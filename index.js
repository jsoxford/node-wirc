var wirc = exports;

exports.Client           = require('./lib/Client');
exports.UdpControl       = require('./lib/control/UdpControl');
//exports.VideoStream        = require('./lib/video/VideoStream');

exports.createClient = function(options) {
  var client = new wirc.Client(options);
  //client.resume();
  return client;
};

exports.createUdpControl = function(options) {
  return new wirc.UdpControl(options);
};

// exports.createVideoStream = function(options) {
//   var stream = new wirc.VideoStream(options);
//   stream.resume();
//   return stream;
// };
