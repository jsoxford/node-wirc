var commands = require('./commands');
var commandManager = require('./commandManager')(commands);
var Q = require('q');
var dgram = require('dgram');
var os = require('os');
var net = require('net');

// Fills an array with a particular value
var fill = function(value, length) {
    var array = []
    for (var i = 0; i < length; i++) {
        array.push(value);
    }
    return array;
};

// Function that returns the same value
var unity = function(value) { return value; };

// Client object to connect to a device
module.exports = function(options) {
    var client = {
        devices: {},
        desiredChannels: fill(1500, 12),
        actualChannels: fill(1500, 12),
        batteries: [],
        digitalInputs: []
    };

    // Ports for recieving data (largely arbitrary)
    client.localPorts = {
        discovery: 24454,
        control: 24454
    };

    // Ports for sending signals to the device
    client.remotePorts = {
        discovery: 1984,
        config: 1984,
        control: null
    };

    // Device configuration
    client.deviceSettings = {
        deviceType: 0,
        version: [0, 1],
        priority: 0xff,
        transmitterName: 'node-wirc'
    };

    // Sets filters for channels
    client.channelFilters = fill(unity, 12);
    if (options.filters) {
        for (i in options.filters) {
            if (options.filters[i]) client.channelFilters[i] = options.filters[i];
        }
    }

    client.discover = function() {
        // Sets up deferred to create a promise for the socked callback
        var deferred = Q.defer();
        var self = this;

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

        addresses = [addresses[1]];

        // Performs broadcast discovery on each interface
        addresses.forEach(function(address) {
            // Sets up a broadcast socket
            var socket = dgram.createSocket('udp4');
            socket.bind(self.localPorts.discovery, address);
            socket.setBroadcast(true);

            // Sends the broadcast discover command
            var buffer = commandManager.encode('broadcastDiscover', self.deviceSettings);
            socket.send(buffer, 0, buffer.length, self.remotePorts.discovery, "255.255.255.255");
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
    };

    client.connect = function(serialNumber) {
        // Sets up deferred to create a promise for the socked callback
        var deferred = Q.defer();
        var self = this;

        // This defines the device we are trying to connect to
        self.serialNumber = serialNumber;

        // Create a socket to listen for status messages on
        var status = dgram.createSocket('udp4');

        status.on('message', function(buffer) {
            var response = commandManager.decode(buffer);
            self.batteries = response.batteries;
            self.digitalInputs = response.digitalInputs;
        })
        .bind();

        // add the port to be sent to device settings
        self.deviceSettings.statusPort = status.address().port;

        // Sets up a TCP socket
        var socket = new net.Socket();
        var device = this.chosenDevice();
        socket.connect(self.remotePorts.config, device.remoteAddress);

        // store the control socket for
        // starting the camera
        self._ctrl = socket;

        // Sends all mandatory config commands
        socket.on('connect', function() {
            var buffer = commandManager.encode('transmitterLogin', self.deviceSettings);
            socket.write(buffer);

            // Time periods for servo outputs
            var buffer = commandManager.encode('channelConfig', {timePeriods: fill(15000, 12)});
            socket.write(buffer);

            // Default values for outputs when not sent a signal
            var buffer = commandManager.encode('failsafeConfig', {channelValues: fill(0, 12)});
            socket.write(buffer);
        });

        // Retrieves the response
        socket.on('data', function(buffer) {
            var response = commandManager.decode(buffer);
            if (response.command == 'loginComplete') {
                self.remotePorts.control = response.controlPort;
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    client.enable = function() {
        // Sets up deferred to create a promise for the socked callback
        var deferred = Q.defer();
        var self = this;

        // Sets up a UDP socket
        var socket = dgram.createSocket('udp4');
        socket.bind(self.localPorts.control);

        // Poll device with control signal
        var device = this.chosenDevice();
        this.controlPolling = setInterval(function() {

            self.actualChannels = self.desiredChannels.map(function(channel, i) {
                return self.channelFilters[i](channel, self.actualChannels[i]);
            });

            var buffer = commandManager.encode('controlChannels', {channelValues: self.actualChannels});
            socket.send(buffer, 0, buffer.length, self.remotePorts.control, device.remoteAddress);

        }, 15);

        deferred.resolve();

        return deferred.promise;
    };


    // initiate a video stream and call back with the jpgs
    client.startCamera = function(id, fn) {
        var self = this;
        var device = self.chosenDevice();

        // Listen out for the video stream
        var socket = dgram.createSocket("udp4");
        socket.bind(24456);

        var buffer = commandManager.encode('startCameraStream', {
            id: id,
            cameraPort: 24456
        });

        socket.send(buffer, 0, buffer.length, self.remotePorts.control, device.remoteAddress);

        socket.on('message', function(buffer) {
            var data = commandManager.decodeJpeg(buffer);
            fn.call(self, data);
        });
    };

    client.chosenDevice = function() {
        return this.devices[this.serialNumber];
    }

    return client;
};
