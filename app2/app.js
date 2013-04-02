var commands = require('./commands');
var commandManager = require('./commandManager')(commands);
var clientCreator = require('./client');
var dgram = require('dgram');
var net = require('net');
var fs = require('fs');
var childProcess = require('child_process');

// Binds a function to an object
var bind = function(object, fn) { return function() { return fn.apply(object, arguments); }; };

// Filter to prevent car drive servo locking up
var midPoint = 1500;
var rateChange = 3;
var interiaDelay = 0;
var carServoFilter = function(desired, actual) {
    var directionChange = midPoint - actual > 0 != midPoint - desired > 0;

    if (directionChange && interiaDelay <= 0) {
        interiaDelay = 35;
        // TODO: more testing of this part
        //interiaDelay = parseInt(Math.abs(midPoint - actual) / rateChange);
    }
    if (interiaDelay > 0) interiaDelay--;

    return interiaDelay > 0 ? midPoint : desired;
};

// Discovery
var client = clientCreator({
    filters: { 1: carServoFilter },
    controls: {
        // Methods to control the movement of the car
        steer: {input: [-1, 1], output: [1200, 1800], channel: 0},
        move: {input: [-1, 1], output: [1200, 1800], channel: 1},
    }
});

// Custom code for your app
client.discover()
    .then(bind(client, client.connect))
    .then(bind(client, client.monitorStatus))
    .then(bind(client, client.enable))
    .then(function() {
        var device = client.chosenDevice();

        // Moves steering left and right
        var i = 0
        setInterval(function() {
            client.steer(Math.sin(i/50));
            i++;
        }, 15);

        // This hacky code gets the camera image pixels, via imagemagick
        var i = 0;
        var socket = dgram.createSocket('udp4');
        socket.bind(client.localPorts.camera);
        var buffer = commandManager.encode('startCameraStream', {id: 0, cameraPort: client.localPorts.camera});
        socket.send(buffer, 0, buffer.length, client.remotePorts.control, device.remoteAddress);
        socket.on('message', function(buffer) {
            var data = commandManager.decodeJpeg(buffer);
            fs.open('img.jpg', 'w', function(err, fd) {
                fs.write(fd, data.image, 0, data.image.length, 0, function() {
                    var stream = childProcess.spawn('stream', ['-map', 'rgb', '-storage-type', 'char', 'img.jpg', 'img.dat']);
                    stream.on('close', function (code) {
                        fs.readFile('img.dat', {}, function(err, data) {
                            i = i + 1;
                            console.log(i);
                        });
                    });
                });
            });
        });
    });
