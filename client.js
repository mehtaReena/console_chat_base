const io = require("socket.io-client")('http://localhost:3000'); ;
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin,  output: process.stdout });


var name;
var id;
//
// write your code here
var socket = io.connect();


socket.on('connect', () => {
    if(name==undefined){
        rl.question("What is your name? ", function(user) {
            console.log("Successfully connected to server");  
            name = user;
            id=socket.id;
            var msg = name + " has joined the game"; 
           // io.emit('simple chat message',{msg,id});             
            rl.prompt(true);
            askChoice();
            
        });

       
    }    
   
  });

  
/* rl.on('line', function (line) {       
    // send chat message
   io.emit('simple chat message',name+": "+line);   
   rl.prompt(true);
        
}); */


socket.on('disconnect', () => {
    console.log('Connection lost...!');
});

function askChoice(){
rl.question("R)ock, (P)aper or (S)cissors? ", function(option){
    if(option.toLowerCase()==='r'){
        option="Rock";
    }
    if(option.toLowerCase()==='p'){
        option="Paper";
    }
    if(option.toLowerCase()==='s'){
        option="Scissors";
    }
    console.log("You chose "+ option );
    console.log("Waiting for response");
     io.emit('player choice',id,name,option);

    });

}


socket.on('simple chat message', function (data) {
    
    if(data) {
        console.log(data); 
       
    }
       
    
     
  });

  socket.on('player2', function (data) {
    if(data) {
        console.log(data); 
        askChoice();
    }
    
  });

  socket.on('player1', function (data) {
    if(data) {
        console.log(data); 
        askChoice();
    } 
  });

  


