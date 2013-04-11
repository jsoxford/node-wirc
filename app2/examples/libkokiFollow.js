var client = require('../car');
var childProcess = require('child_process');
var koki = require("./koki");

client.discover()
    .then(function(serialNumber) { return client.connect(serialNumber); })
    .then(function() { return client.enable(); })
    .then(function() {

        var device = client.chosenDevice();

        client.startCamera(0, function(data) {
            koki.findMarkers(data.image, function(err, markers) {
                if (markers[0]) {
                    var marker = markers[0].centre.world
                    client.steer(marker.x * -3);
                    client.move((marker.y - 0.5) * 0.7);
                    console.log(marker);
                }
                else {
                    client.move(0);
                }
            });
        });
    });
