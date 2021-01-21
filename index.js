var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var firebase = require("firebase")

firebase.initializeApp({

    databaseURL: "https://gamedb-281a0-default-rtdb.firebaseio.com/",

    serviceAccount: './gamedb.json', //this is file that I downloaded from Firebase Console

});

var db = firebase.database();

var playersRef = db.ref("players");




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
             let player1Name=choices[0]['user'] ;
             let player2Name=choices[1]['user'];
             let player1Choice=choices[0]['choice'];
             let player2Choice=choices[1]['choice'];  
             let msg1=""; 
             let msg2="";   

             switch (choices[0]['choice'])
             {
                 case 'rock':
                     switch (choices[1]['choice'])
                     {
                         case 'rock': 
                              msg1= "Draw !";
                              msg2 ="Draw !"  ;                          
                             io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice+ '-  '+ msg1); 
                             io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice+ '-  '+ msg2); 
                             setData(choices,msg1,msg2);
                             break;
 
                         case 'paper': 
                             msg1= player1Name+" Lose";
                             msg2 =player2Name+" Win"  ;                         
                            io.to(player2ID).emit('player2', player1Name+ " chose " +player1Choice+' - You Win :)');   
                            io.to(player1ID).emit('player1', player2Name+ " chose " +player2Choice+' - You Lose :('); 
                            setData(choices,msg1,msg2);         
                             break;
         
                         case 'scissors':  
                             msg2= player2Name+" Lose";
                             msg1 =player1Name+" Win"  ;                          
                             io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice+'- You Win :)');                           
                             io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice+' - You Lose :(');
                             setData(choices,msg1,msg2);
                             break;
 
                         default:
                             break;
                     }
                     break;
 
                 case 'paper':
                     switch (choices[1]['choice'])
                     {
                         case 'rock':
                            msg1 =player1Name+" Win"  ;  
                            msg2= player2Name+" Lose";                             
                            io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice + '-  You Win  :)');                          
                            io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice+' -   You Lose :('); 
                            setData(choices,msg1,msg2);                          
                             break;
 
                         case 'paper':
                            msg1 ="Draw !"  ; 
                            msg2= "Draw !"; 
                             io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice+' -  '+ msg1); 
                             io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice+' -  '+ msg2 ); 
                             setData(choices,msg1,msg2);
                             break;
         
                         case 'scissors':  
                            msg2 =player2Name+" Win"  ; 
                            msg1= player1Name+" Lose";                         
                            io.to(player2ID).emit('player2', player2Name + " chose " +player2Choice+' -  You Win :)');                           
                            io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice+'  - You Lose :(');  
                            setData(choices,msg1,msg2);                           
                             break;
 
                         default:
                             break;
                     }
                 break;
 
                 case 'scissors':
                     switch (choices[1]['choice'])
                     {
                         case 'rock':   
                            msg2 =player2Name +" Win"  ; 
                            msg1= player1Name +" Lose";                        
                           io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice +'- You Win :)');                        
                           io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice +' - You Lose :(');  
                           setData(choices,msg1,msg2);  
                            
                             break;
 
                         case 'paper': 
                             msg1 =player1Name +" Win"  ; 
                             msg2= player2Name+" Lose";                          
                            io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice +' - You Win :)');                                
                            io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice +' - You Lose :(');   
                            setData(choices,msg1,msg2); 
                             
                             break;
         
                         case 'scissors':
                            msg1 ="Draw !"  ; 
                            msg2= "Draw !"; 
                            io.to(player1ID).emit('player1', player2Name + " chose " +player2Choice +'   - Draw !'); 
                            io.to(player2ID).emit('player2', player1Name + " chose " +player1Choice +'   - Draw !'); 
                            setData(choices,msg1,msg2);
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

function setData(player, msg1,msg2){
     gameStatus=
        {
            player1_id:player[0]['userid'],
            Player1_name:player[0]['user'],
            Player1_choice:player[0]['choice'],
            result :msg1,
            player2_id:player[1]['userid'],
            Player2_name:player[1]['user'],
            Player2_choice:player[1]['choice'],
            result2 :msg2
        }

        playersRef.push(gameStatus);
}

