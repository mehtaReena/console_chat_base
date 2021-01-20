var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


users = [];
connections = [];
choices = [];

io.on('connection', (socket) => {   
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    let eventName = 'simple chat message';
    let broadcast = (msg) => socket.broadcast.emit(eventName, msg);

    socket.on(eventName, (msg) => {        
        console.log('message: ' + msg.msg );
        // broadcast to other clients after 1.5 seconds
        setTimeout(broadcast, 1500, msg.msg);
    });

    socket.on('player choice', function (userid,username, choice) {
         choices.push({'userid': userid,'user': username, 'choice': choice.toLowerCase()});
         console.log( username+" says "+ choice);
         if(choices.length == 2) {            
           
             let player1ID=socketId=choices[0]['userid']; 
             let player2ID=socketId=choices[1]['userid']; 

             switch (choices[0]['choice'])
             {
                 case 'rock':
                     switch (choices[1]['choice'])
                     {
                         case 'rock':                             
                             io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' - Draw'); 
                             io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' - Draw '); 
                             break;
 
                         case 'paper':                          
                            io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' - You win :)');   
                            io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' - You loss :('); 
                                        
                             break;
         
                         case 'scissors':                            
                             io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' -You win :)');                           
                             io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' - You loss :('); 
                              
                             break;
 
                         default:
                             break;
                     }
                     break;
 
                 case 'paper':
                     switch (choices[1]['choice'])
                     {
                         case 'rock':                           
                            io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' -You win :)');                           
                            io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' -You loss :(');                            
                             break;
 
                         case 'paper':
                             io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' - Draw'); 
                             io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' - Draw '); 
                             break;
         
                         case 'scissors':                          
                            io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' -You win :)');                            
                            io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' -You loss :(');                            
                             break;
 
                         default:
                             break;
                     }
                 break;
 
                 case 'scissors':
                     switch (choices[1]['choice'])
                     {
                         case 'rock':                          
                           io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' -You win :)');                          
                           io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' -You loss :('); 
                            
                             break;
 
                         case 'paper':                          
                            io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' -You win :)');                           
                            io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' -You loss :('); 
                             
                             break;
         
                         case 'scissors':
                            io.to(player1ID).emit('player1', choices[1]['user'] + " chose " +choices[1]['choice']+' - Draw'); 
                            io.to(player2ID).emit('player2', choices[0]['user'] + " chose " +choices[0]['choice']+' - Draw '); 
                             break;
 
                         default:
                             break;
                     }
                     break;
 
                 default:
                     break;
             }
 
            choices=[];
         }

 });
 
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});