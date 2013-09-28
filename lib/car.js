var clientCreator = require('./client');

// Filter to work around car motor's regenerative breaking
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

// Car client object
var client = clientCreator({
    filters: { 1: carServoFilter },
});

var STEERING_LEFT = 2000, STEERING_RIGHT = 1000, INPUT_LEFT = -1, INPUT_RIGHT = 1;
// Maps steering linearly to nice values
client.steer = function(input) {
    var outputRange = STEERING_RIGHT - STEERING_LEFT;
    var inputRange = INPUT_RIGHT - INPUT_LEFT;
    var value = (input - INPUT_LEFT) / inputRange * outputRange + STEERING_LEFT;
    this.desiredChannels[0] = parseInt(value);
};

// Maps movement to easier values, attempting to avoid motor dead zone
// Not perfect by any means!
client.move = function(input) {
    if (input > 0) {
        var outputRange = 1800 - 1550;
        var value = input * outputRange + 1550;

        return this.desiredChannels[1] = parseInt(value);
    }

    if (input < 0) {
        var outputRange = 1450 - 1200;
        var value = input * outputRange + 1450;

        return this.desiredChannels[1] = parseInt(value);
    }

    this.desiredChannels[1] = 1500;
}

module.exports = client;
