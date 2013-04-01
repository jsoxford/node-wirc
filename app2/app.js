var commands = require('./commands');
var commandManager = require('./commandManager')(commands);
var dgram = require('dgram');
var net = require('net');
var Q = require('./vendor/q');
var os = require('os');

var bindPort = 24454;
var configPort = 1984;

// Ports for recieving data (largely arbitrary)
var localPorts = {
    discovery: 24454,
    status: 24455
};

// Ports for sending signals to the device
var remotePorts = {
    discovery: 1984,
    config: 1984,
    control: null,
    status: null
}

// Gets all IPs assigned to this machine
var addresses = [];
var interfaces = os.networkInterfaces();
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

// Device configuration
var device = {
    deviceType: 0,
    version: [0, 1],
    priority: 0xff,
    transmitterName: 'node-wirc',
    statusPort: 24455
};

// Time periods for servo outputs
var channelConfig = {
    timePeriods: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000]
};

// Default values for outputs when not sent a signal
// 0 is off, 255 is last known value
var failsafeConfig = {
    channelValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

// Values to be sent to the device initially
var initialValues = function() {
    return [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500]
};

var midPoint = 1500;
var rateChange = 3;
var interiaDelay = 0;

// Binds a function to an object
var bind = function(object, fn) {
    return function() { return fn.apply(object, arguments); };
};

// Discovery
var Client = {
    discover: function(addresses) {
        // Sets up deferred to create a promise for the socked callback
        var deferred = Q.defer();
        var self = this;

        addresses.forEach(function(address) {
            // Sets up a broadcast socket
            var socket = dgram.createSocket('udp4');
            socket.bind(bindPort, address);
            socket.setBroadcast(true);

            // Sends the broadcast discover command
            var buffer = commandManager.encode('broadcastDiscover', device);
            socket.send(buffer, 0, buffer.length, configPort, "255.255.255.255");
            socket.on('message', function(buffer, info) {
                // Recieves the command and fulfills the promise
                var response = commandManager.decode(buffer);
                response.remoteAddress = info.address;
                response.localAddress = address;
                self.devices[response.serialNumber] = response;
                deferred.resolve(response.serialNumber);
                socket.close();
            });
        })

        return deferred.promise;
    },

    connect: function(serialNumber) {
        // Sets up deferred to create a promise for the socked callback
        var deferred = Q.defer();
        var self = this;

        // Sets up a TCP socket
        var socket = new net.Socket();
        var deviceInfo = this.devices[serialNumber];
        socket.connect(configPort, deviceInfo.remoteAddress);

        // Sends all mandatory config commands
        socket.on('connect', function() {
            var buffer = commandManager.encode('transmitterLogin', device);
            socket.write(buffer);

            var buffer = commandManager.encode('channelConfig', channelConfig);
            socket.write(buffer);

            var buffer = commandManager.encode('failsafeConfig', failsafeConfig);
            socket.write(buffer);
        });

        // Retrieves the response
        socket.on('data', function(buffer) {
            var response = commandManager.decode(buffer);
            if (response.command == 'loginComplete') {
                self.controlPort = response.controlPort;
                self.serialNumber = serialNumber;
                deferred.resolve();
            }
        });

        return deferred.promise;
    },

    enable: function() {
        var deferred = Q.defer();
        var self = this;

        var socket = dgram.createSocket('udp4');
        var deviceInfo = this.devices[this.serialNumber];
        socket.bind(bindPort);

        // Poll car with control signal
        clearInterval(this.controlPolling);
        this.controlPolling = setInterval(function() {
            Client.actualChannels = Client.channels.map(function(channel, i) {
                if (i == 1) {
                    var directionChange = midPoint - Client.actualChannels[i] > 0 != midPoint - channel > 0;

                    if (directionChange && interiaDelay <= 0) {
                        interiaDelay = 35;
                    }
                    if (interiaDelay > 0) interiaDelay--;

                    return interiaDelay > 0 ? midPoint : channel;
                }

                return channel;
            });

            var buffer = commandManager.encode('controlChannels', {channelValues: Client.actualChannels});
            socket.send(buffer, 0, buffer.length, self.controlPort, deviceInfo.remoteAddress);
        }, 15);

        deferred.resolve();
        return deferred.promise;
    },

    devices: {},
    channels: initialValues(),
    actualChannels: initialValues()
}

Client.discover(addresses)
    .then(bind(Client, Client.connect))
    .then(bind(Client, Client.enable))
    .then(function() {
        var i = 0
        setInterval(function() {
            var oscillation = Math.sin(i/100);
            Client.channels[0] = 1500 - parseInt(300 * oscillation);
            Client.channels[1] = 1500 + parseInt(100 * oscillation);
            i++;
        }, 15);

        var socket = dgram.createSocket('udp4');
        socket.bind(device.statusPort);
        socket.on('message', function(buffer) {
            var response = commandManager.decode(buffer);
            //console.log(response);
        });

        // setTimeout(function() { Client.channels[1] = 1600; }, 1000);
        // setTimeout(function() { Client.channels[1] = 1300; }, 3000);
        // setTimeout(function() { Client.channels[1] = 1600; }, 4000);
        // setTimeout(function() { Client.channels[1] = 1000; }, 5000);
        // setTimeout(function() { Client.channels[1] = 2000; }, 6000);
        // setTimeout(function() { Client.channels[1] = 1500; }, 7000);
    });
