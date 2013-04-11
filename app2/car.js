var clientCreator = require('./client');

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
module.exports = clientCreator({
    filters: { 1: carServoFilter },
    controls: {
        // Methods to control the movement of the car
        steer: {input: [-1, 1], output: [1200, 1800], channel: 0},
        move: {input: [-1, 1], output: [1200, 1800], channel: 1},
    }
});
