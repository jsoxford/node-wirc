// Simplest possible example, car go move!
var client = require('../lib/car');

var serialNumber = 0;

client.discover()
    .then(function() { return client.connect(serialNumber); })
    .then(function() { return client.enable(); })
    .then(function() {

        var steer = 1;
        var move = 0.5;

        // Full left (might be right...)
        client.steer(steer);

        // Full forward!
        client.move(move);

        // Let's dance
        setInterval(function() {

            // And the other way
            steer = -steer;
            move = -move;

            client.move(move);
            client.steer(steer);
        }, 800)
    });
