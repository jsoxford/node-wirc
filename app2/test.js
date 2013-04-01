var commands = require('./lib/Commands.js');
var CommandManager = require('./lib/data/CommandManager.js')(commands);

var message = {deviceType: 0, version: [1, 2]};
var encoded = CommandManager.encode('broadcastDiscover', message);
var decoded = CommandManager.decode(encoded);
console.log(message);
console.log(decoded);

var message = {hardwareVersion: [1, 2], softwareVersion: [3, 4], deviceName: 'Moo', serialNumber: '12345'};
var encoded = CommandManager.encode('broadcastRespond', message);
var decoded = CommandManager.decode(encoded);
console.log(message);
console.log(decoded);

var message = {deviceName: 'Moon-moon'};
var encoded = CommandManager.encode('deviceConfig', message);
var decoded = CommandManager.decode(encoded);
console.log(message);
console.log(decoded);

var message = {ssid: '123456789', password: 'password', accessPoint: true, secured: false, channel: 1, country: 'en'};
var encoded = CommandManager.encode('wifiConfig', message);
var decoded = CommandManager.decode(encoded);
console.log(message);
console.log(decoded);
