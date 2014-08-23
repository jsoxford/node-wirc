// Changes the car's wifi settings, use with extreme caution!
var client = require('../lib/car');
var commands = require('../lib/commands');
var commandManager = require('../lib/commandManager')(commands);

client.discover()
    .then(function(serialNumber) {
        console.log("Discovered");
        return client.connect(serialNumber);
    })
    .then(function() {
        console.log('Connected');

        setTimeout(function() {
            console.log("Updating wifi");
            var buffer = commandManager.encode('wifiConfig', {
                ssid: 'Dension WiRC '+client.serialNumber,
                password: '',
                accessPoint: true,
                secured: false,
                channel: 11,
                country: 'en'
            });
            client._ctrl.write(buffer, function() {
                console.log('Updated');
            });
        }, 1000);
    });
