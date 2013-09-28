var client = require('../lib/car');
var childProcess = require('child_process');
var rgb2hsl = require('color-convert').rgb2hsl;

client.discover()
    .then(function(serialNumber) {
        console.log("Discoverd", serialNumber);
        return client.connect(serialNumber);
    }).then(function() {
        console.log("Enabling"); return client.enable();
    }).then(function() {
        console.log("Yay! start work");

        var device = client.chosenDevice();

        var i = 0;
        client.startCamera(0, function(data) {

            if (i % 3 == 0) {
                (function(i) {
                    var test = require('child_process').spawn('convert', ['jpeg:-', 'rgb:-']);

                    var buffers = [];
                    test.stdout.on('data', function (data) { buffers.push(data); });
                    test.stdout.on('end', function() {
                        var image = Buffer.concat(buffers);

                        var width = 352;
                        var height = 288;
                        var x, y, z, pixels = [];
                        for (y = 0; y < height; y++) {
                            for (x = 0; x < width; x++) {
                                z = (x + y * width) * 3;
                                if (image[z + 2]) {
                                    var hsl = rgb2hsl(image[z], image[z + 1], image[z + 2]);

                                    // Checks for the desired colour
                                    if (hsl[0] > 328 && hsl[0] < 356 && hsl[1] > 35 && hsl[1] < 62) {
                                        pixels.push([x, y]);
                                    }
                                }
                            }
                        }

                        x = 0; y = 0;
                        pixels.map(function(pixel) {
                            x = x + pixel[0];
                            y = y + pixel[1];
                        });

                        var move, steer;

                        if (pixels.length > 20) {
                            x = (x / pixels.length + 0.5) / width;
                            y = (y / pixels.length + 0.5) / height;
                            move = (50 - Math.sqrt(pixels.length)) / 200;
                            move = move > 0 ? move + 0.2 : move - 0.4;
                            steer = (x - 0.5) * 0.8;
                        }
                        else {
                            move = 0;
                            steer = 0;
                        }

                        client.steer(steer);
                        client.move(move);
                    });

                    test.stdin.write(data.image);
                    test.stdin.end();
                })(i);
            }

            i++;
        });
    });
