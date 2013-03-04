// run this to drive slowly forward for 5 seconds

var Client = require('../lib/Client');

var client = new Client();
client.resume();

client.forward(2);

//client.finish();
