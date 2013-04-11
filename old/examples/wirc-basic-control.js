// run this to drive slowly forward for 5 seconds

var Client = require('../lib/Client');

var client = new Client();
    
client
    .resume()
    .after(5000, function(){
        this.forward(0.2);
    })
    // .after(1000, function(){
    //     this.left(0.5);
    //     this.backward(0.4);
    // })
    // .after(1000, function(){
    //     this.stop();
    // })
    // .after(500, function(){
    //     this.finish();
    // });


