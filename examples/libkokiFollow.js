var client = require('../lib/car');
var childProcess = require('child_process');
var koki = require("../lib/koki");

client.discover()
    .then(function(serialNumber) {
        console.log("Discoverd", serialNumber);
        return client.connect(serialNumber);
    }).then(function() {
        console.log("Enabling"); return client.enable();
    }).then(function() {
        console.log("Yay! start work");

        var device = client.chosenDevice();
        var steer = 0;
        var move = 0;

        client.startCamera(0, function(data) {
            koki.findMarkers(data.image, function(err, markers) {
                if (markers[0]) {
                    var marker = markers[0].centre.world;
                    steer = marker.x * 3;
                    move = (marker.y - 1) * 0.7;
                    client.steer(steer);
                    client.move(move);
                }
                else {
                    move = move * 0.8;
                    client.move(move);
                }
            });
        });
    });
