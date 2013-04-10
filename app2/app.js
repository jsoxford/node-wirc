var clientCreator = require('./client');
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
    .then(bind(client, client.enable))
    .then(function() {
        var device = client.chosenDevice();

        // Moves steering left and right
        var i = 0
        setInterval(function() {
            client.steer(Math.sin(i/50));
            i++;
        }, 15);

        client.startCamera(0, function(data) {
            fs.open('img.jpg', 'w', function(err, fd) {
                fs.write(fd, data.image, 0, data.image.length, 0, function() {
                    var stream = childProcess.spawn('stream', ['-map', 'rgb', '-storage-type', 'char', 'img.jpg', 'img.dat']);
                    stream.on('close', function (code) {
                        fs.readFile('img.dat', {}, function(err, data) {
                            console.log(data.length);
                        });
                    });
                });
            });
        });
    });
