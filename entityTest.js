const RustPlus = require('@liamcottle/rustplus.js');
const fs = require("fs")
// var rustplus = new RustPlus('85.215.152.210', '28089', '76561199241883275', '-1290471355');
var rustplus = new RustPlus('85.215.152.210', '28089', '76561198315729279', "-1527250958");

// wait until connected before sending commands
rustplus.on('connected', (a) => {
    console.log("connected")

    console.log(rustplus.isConnected())

    rustplus.sendTeamMessage('Rust-LJ is now online!', (a) => {
        console.log(a)
    })

    rustplus.getEntityInfo(10605520, (data) => {
        console.log("Get Entity Info:")
        console.log(JSON.stringify(data, null, 4))
    })

    rustplus.setEntityValue(10605520, true);

    rustplus.on('message', (message) => {
        console.log("Message:")
        console.log(JSON.stringify(message, null, 4))
        fs.appendFile('message.txt', JSON.stringify(message, null, 4) + "\n", function (err) {
            if (err) throw err;
          });
        // if(message.broadcast && message.broadcast.entityChanged){
    
        //     var entityChanged = message.broadcast.entityChanged;
        
        //     var entityId = entityChanged.entityId;
        //     var value = entityChanged.payload.value;
        //     var capacity = entityChanged.payload.capacity;
        //     var items = entityChanged.payload.items;
            
        //     // only print info when second broadcast is received
        //     if(!value){
    
        //         console.log(`entity ${entityId} has a capacity of ${capacity}`);
        //         console.log(`entity ${entityId} contains ${items.length} item(s)`);
                
        //         // print out the items in this storage entity
        //         items.forEach((item) => {
        //             console.log(item);
        //         });
    
        //     }
    
        // }
    });

    // rustplus.on('request', (message) => {
    //     console.log("Request:")
    //     console.log(JSON.stringify(message, null, 4))
    //     fs.appendFile('request.txt', JSON.stringify(message, null, 4) + "\n", function (err) {
    //         if (err) throw err;
    //       });
    // });

});



// connect to rust server
try {
    rustplus.connect()
} catch (e) {
    console.log(e)
}

rustplus.on("error", (error) => {
    console.log(error)
})