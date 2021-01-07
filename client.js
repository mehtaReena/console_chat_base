const io = require("socket.io-client")('http://localhost:3000'); ;
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin,  output: process.stdout });


var name;
//
// write your code here
var socket = io.connect();


socket.on('connect', () => {
    if(name==undefined){
        rl.question("Please enter a your name: ", function(user) {
            name = user;
            var msg = name + " has joined the chat"; 
            io.emit('simple chat message',msg);
            console.log(msg);   
            rl.prompt(true);
        });

    }    
   
  });

socket.on('disconnect', () => {
    console.log('Connection lost...!');
});


// Set the username



socket.on('simple chat message', function (data) {
    console.log(data);  
    rl.prompt(true);  
  });



rl.on('line', function (line) {       
         // send chat message
        io.emit('simple chat message',name+": "+line);   
        rl.prompt(true);
             
    });
