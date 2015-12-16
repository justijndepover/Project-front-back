/**
 * Created by Michiel on 10/12/2015.
 */

module.exports = function (io ) {
    // usernames which are currently connected to the chat
   // var usernames = {};

// rooms which are currently available in chat
    var rooms = {};

    var pcs = {};

    function makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function addRoom(socket){
        var roomId = makeid();
        if(rooms.hasOwnProperty(roomId)){
            addRoom();
        }else{
            rooms[roomId] = {usernames:{},room:socket.id, canJoin:true};
        }
        socket.room = roomId;
    }

    io.sockets.on('connection', function (socket) {
        socket.on('pcconnect',function(){
            console.log("new room is made: "+socket.id);
            //rooms[roomId]=socket.id;
            addRoom(socket);
            console.log(rooms);
            // store the room name in the socket session for this client

            // join room
            //socket.join(socket.id);
            if (io.sockets.connected[socket.id]) {
                io.sockets.connected[socket.id].emit('requestRoom', socket.room);
            }
        });

        socket.on('gsmConnect',function(data){
            var message;
            if(data.room in rooms) {
                if (Object.keys(rooms[data.room].usernames).length < 4 && rooms[data.room].canJoin == true){
                    console.log(data.username + " connected to " + data.room);
                    socket.username = data.username;
                    // store the room name in the socket session for this client
                    socket.room = data.room;
                    // join room
                    socket.join(data.room);
                    // add the client's username to the global list
                    rooms[data.room].usernames[data.username] = data.username;
                    console.log(rooms);
                    console.log("gsm connect: " + rooms[socket.room].room);
                    message = "connectionEstablished";
                    if (io.sockets.connected[rooms[socket.room].room]) {
                        io.sockets.connected[rooms[socket.room].room].emit('updateusers', rooms[data.room].usernames);
                    }
                }
                else {
                    message = "roomFull";
                }
            }else {
                message = "connectionRefused";
            }
            console.log(message);
            socket.emit("message", message);
        });

        var leaveRoom = function (){
            if(socket.room in rooms){
                delete rooms[socket.room].usernames[socket.username];
                socket.leave(socket.room);
                if (io.sockets.connected[rooms[socket.room]]) {
                    io.sockets.connected[rooms[socket.room].room].emit('updateusers', rooms[socket.room].usernames);
                }
                console.log(socket.username + " has left "+  socket.room);
            }
        };

        socket.on('gsmDisconnect',function(msg){
            leaveRoom();
        });

        socket.on('deviceOrientation', function(msg){
            if (io.sockets.connected[rooms[socket.room]]) {
                msg.username=socket.username;
                io.sockets.connected[rooms[socket.room].room].emit('deviceOrientation', msg);
            }
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function(){
            if('username' in socket){
                leaveRoom();
            }else{
                socket.to(socket.room).emit("roomDisconnect",null);
                delete rooms[socket.room];
            }
        });

        socket.on("startGame", function (data) {
            console.log(socket.room);
            // emit naar room
            socket.to(socket.room).emit("message","startGame");
            rooms[data.room].canJoin = false;
        });

        socket.on("pauseGame", function (data) {

        });
    });
};