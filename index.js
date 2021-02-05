var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;


//const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const CONNECTION_URL = "mongodb+srv://reenamehta:Password@123@cluster0.gsybx.mongodb.net/playerdb?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";


// The database to use
const DATABASE_NAME = "playerdb";

users = [];

choices = [];

io.on('connection', (socket) => {


    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    let eventName = 'simple chat message';
    let broadcast = (msg) => socket.broadcast.emit(eventName, msg);

    socket.on(eventName, (msg) => {
        console.log('message: ' + msg.msg);
        // broadcast to other clients after 1.5 seconds
        setTimeout(broadcast, 1500, msg.msg);
    });

    socket.on('player choice', function (userid, username, choice) {
        choices.push({ 'userid': userid, 'user': username, 'choice': choice.toLowerCase() });
        console.log(username + " says: " + choice);
        if (choices.length == 2) {

            let player1ID = socketId = choices[0]['userid'];
            let player2ID = socketId = choices[1]['userid'];
            let player1Name = choices[0]['user'];
            let player2Name = choices[1]['user'];
            let player1Choice = choices[0]['choice'];
            let player2Choice = choices[1]['choice'];
            let msg1 = "";
            let msg2 = "";

            switch (choices[0]['choice']) {
                case 'rock':
                    switch (choices[1]['choice']) {
                        case 'rock':
                            msg1 = "Draw";
                            msg2 = "Draw";
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + '-  ' + msg1);
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + '-  ' + msg2);
                            setData(choices, msg1, msg2);
                            break;

                        case 'paper':
                            msg1 = "Loss";
                            msg2 = "Win";
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + ' - You Win :)');
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + ' - You Lose :(');
                            setData(choices, msg1, msg2);
                            break;

                        case 'scissors':
                            msg2 = "Loss";
                            msg1 = "Win";
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + '- You Win :)');
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + ' - You Lose :(');
                            setData(choices, msg1, msg2);
                            break;

                        default:
                            break;
                    }
                    break;

                case 'paper':
                    switch (choices[1]['choice']) {
                        case 'rock':
                            msg1 = "Win";
                            msg2 = "Loss";
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + '-  You Win  :)');
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + ' -   You Lose :(');
                            setData(choices, msg1, msg2);
                            break;

                        case 'paper':
                            msg1 = "Draw";
                            msg2 = "Draw";
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + ' -  ' + msg1);
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + ' -  ' + msg2);
                            setData(choices, msg1, msg2);
                            break;

                        case 'scissors':
                            msg2 = "Win";
                            msg1 = "Loss";
                            io.to(player2ID).emit('player2', player2Name + " chose " + player2Choice + ' -  You Win :)');
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + '  - You Lose :(');
                            setData(choices, msg1, msg2);
                            break;

                        default:
                            break;
                    }
                    break;

                case 'scissors':
                    switch (choices[1]['choice']) {
                        case 'rock':
                            msg2 = "Win";
                            msg1 = "Loss";
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + '- You Win :)');
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + ' - You Lose :(');
                            setData(choices, msg1, msg2);

                            break;

                        case 'paper':
                            msg1 = "Win";
                            msg2 = "Loss";
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + ' - You Win :)');
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + ' - You Lose :(');
                            setData(choices, msg1, msg2);

                            break;

                        case 'scissors':
                            msg1 = "Draw";
                            msg2 = "Draw";
                            io.to(player1ID).emit('player1', player2Name + " chose " + player2Choice + '   - Draw !');
                            io.to(player2ID).emit('player2', player1Name + " chose " + player1Choice + '   - Draw !');
                            setData(choices, msg1, msg2);
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }



            choices = [];
        }

    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');

    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        playersCollection = database.collection("Players");
        leaderCollection = database.collection("LeaderBoard");
        console.log("Connected to `" + DATABASE_NAME + "`!");

      
    });
});

function setData(player, msg1, msg2) {
    gameStatus =
    {
        player1_id: player[0]['userid'],
        Player1_name: player[0]['user'],
        Player1_choice: player[0]['choice'],
        result: msg1,
        player2_id: player[1]['userid'],
        Player2_name: player[1]['user'],
        Player2_choice: player[1]['choice'],
        result2: msg2
    }

    // const p =  playersCollection.insertOne(gameStatus);  
      let list=[];
      let message=[];
      list.push(player[0]['user']);
      list.push(player[1]['user']);
      message.push(msg1);
      message.push(msg2);
    //let res1 = updateLeaderBoard(player[0]['user'], msg1);
    //let res2 = updateLeaderBoard(player[1]['user'], msg2);
    //console.log(res1,res2); 
     // printLeaderBoard();

    edit(list ,message);

   
}

function updateLeaderBoard(player, msg) {


    let id = new ObjectId('6013848337779f1fd0ed1e44')
    console.log("player  : " + player + " msg : " + msg);
    leaderCollection.findOne({}, function (err, users) {
        if (err) throw err;
        /* let entries = Object.entries(users);
        //console.log(users.hasOwnProperty('A'))
        for (const [key, value] of Object.entries(users)) {
            //console.log(`${key}: ${value}`);
          } */
        let res = '';

        if (users.hasOwnProperty(player)) {

            let query1 = { name: player };
            let count = "TotalGames"
            leaderCollection.updateOne({ _id: id }, {
                $inc: { [`${query1.name}.${msg}`]: 1, [`${query1.name}.${count}`]: 1 }
            }, { $sort: { Win: 1 } }, {new: true},{ upsert: true },
              function (err, res) {
                if (err) throw err;
                else{
                    console.log(" document(s) updated");
                    leaderCollection.find({_id: id }).toArray(function(err, results) {
                        console.log(results[0]);
                    });

                }          
            });


        }
        else {

            if (msg === 'Draw') {
                leaderCollection.updateOne({ "_id": id }, {
                    $set: { [player]: { Win: 0, Loss: 0, Draw: 1, TotalGames: 1 } }
                },{new: true}, { upsert: true },
                    function (err, res) {
                        if (err) throw err;
                        console.log(" document(s) updated");
                        //db.close();
                    });

            }
            if (msg === 'Win') {
                leaderCollection.updateOne({ "_id": id }, {
                    $set: { [player]: { Win: 1, Loss: 0, Draw: 0, TotalGames: 1 } }
                },{new: true}, { upsert: true },
                    function (err, res) {
                        if (err) throw err;
                        console.log(" document(s) updated");
                        //db.close();
                    });

            }
            if (msg === 'Loss') {
                leaderCollection.updateOne({ "_id": id }, {
                    $set: { [player]: { Win: 0, Loss: 1, Draw: 0, TotalGames: 1 } }
                },{new: true}, { upsert: true },
                    function (err, res) {
                        if (err) throw err;
                        console.log(" document(s) updated");
                        //db.close();
                    });


            }
        }
    });

}

function printLeaderBoard() {

    leaderCollection.findOne({}, function (err, users) {
        if (err) throw err;
        //console.log(users);
        //db.close();



        let entries = Object.entries(users);

        let sorted = entries.sort((a, b) => b[1].Win - a[1].Win);

        //console.log(sorted)
        let = leaderBoad = "---------------- Leaderboard -------------------" + "\n";

        for (i = 1; i < sorted.length; i++) {

            let result = "";
            let wins = sorted[i][1].Win;
            let losses = sorted[i][1].Loss;
            let draws = sorted[i][1].Draw;
            let points = Number(wins) - Number(losses);
            result = result + sorted[i][0];
            result = result + ":  " + points + " Points (";
            result = result + " " + wins + " Wins  ";
            result = result + " " + losses + " Losses ";
            result = result + " " + draws + " Draws ) ";

            leaderBoad = leaderBoad + "\n" + result

        }

        leaderBoad = leaderBoad + "\n \n" + "-------------------------------------------------"
        //console.log(leaderBoad);

        io.emit("simple chat message", leaderBoad);

    });

}


async function edit(players, message) {

 /*    const client = await MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {
        database = client.db(DATABASE_NAME);
        const leaderCollection = database.collection("LeaderBoard");
        console.log("Connected to `" + DATABASE_NAME + "`!"); */
         let output=[];

        for(i=0;i<players.length;i++){
            let player=players[i];
            let msg=message[i];
        let id = new ObjectId('6013848337779f1fd0ed1e44')
        console.log("player  : " + player + " msg : " + msg);
        let users = await leaderCollection.findOne({});

        if (users != null && users.hasOwnProperty(player)) {

            let query1 = { name: player };
            let count = "TotalGames"


            let result = await leaderCollection.updateOne({ "_id": id }, {
                $inc: { [`${query1.name}.${msg}`]: 1, [`${query1.name}.${count}`]: 1 }
            }, { $sort: { Win: 1 } }, {new: true}, { upsert: true });
             output.push(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
              
                  


        }

        else {
             console.log(" Else ...");

            if (msg === 'Draw') {


                let result = await leaderCollection.updateOne({ "_id": id }, {
                    $set: { [player]: { Win: 0, Loss: 0, Draw: 1, TotalGames: 1 } }
                }, { upsert: true }, {new: true});
                output.push(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);

            }
            if (msg === 'Win') {

                let result = await leaderCollection.updateOne({ "_id": id }, {
                    $set: { [player]: { Win: 1, Loss: 0, Draw: 0, TotalGames: 1 } }
                }, { upsert: true }, {new: true});
                output.push(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);

            }
            if (msg === 'Loss') {


                let result = await leaderCollection.updateOne({ "_id": id }, {
                    $set: { [player]: { Win: 0, Loss: 1, Draw: 0, TotalGames: 1 } }
                }, { upsert: true }, {new: true});
                output.push(
                    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);

            }

        }
    }
          

    //console.log(output);
    if(output.length>0){
        printLeaderBoard();       

    }

  /*   } catch (err) {

        console.log(err);
    } finally {

        client.close();
        
    } */

}

async function listAll() {

    const client = await MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        database = client.db(DATABASE_NAME);
        const leaderCollection = database.collection("LeaderBoard");
        console.log("Connected to `" + DATABASE_NAME + "`!");
        const sort = { Win: -1, TotalGames: -1 };
        let users = await leaderCollection.find({}).sort(sort).toArray();

        let entries = Object.entries(users[0]);

        let sorted = entries.sort(
            function (a, b) {
                if (b[1].Win < a[1].Win && b[1].TotalGames <= a[1].TotalGames) { return -1; }
                if (b[1].Win > a[1].Win && b[1].TotalGames <= a[1].TotalGames) { return 1; }
                return 0;
            });

        //console.log(sorted);

        let = leaderBoad = "---------------- Leaderboard -------------------" + "\n";

        for (i = 1; i < sorted.length; i++) {

            let result = "";
            let wins = sorted[i][1].Win;
            let losses = sorted[i][1].Loss;
            let draws = sorted[i][1].Draw;
            let points = Number(wins) - Number(losses);
            result = result + sorted[i][0];
            result = result + ":  " + points + " Points (";
            result = result + " " + wins + " Wins  ";
            result = result + " " + losses + " Losses ";
            result = result + " " + draws + " Draws ) ";

            leaderBoad = leaderBoad + "\n" + result

        }

        leaderBoad = leaderBoad + "\n \n" + "-------------------------------------------------"
        //console.log(leaderBoad);

        io.emit("simple chat message", leaderBoad);
    }

    catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}




