/**
 * Created by Michiel on 10/12/2015.
 */

module.exports = function (io ) {
    // usernames which are currently connected to the chat
    var usernames = {};

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
            rooms[roomId] = socket.id;
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
            socket.join(socket.id);
            if (io.sockets.connected[socket.id]) {
                io.sockets.connected[socket.id].emit('requestRoom', socket.room);
            }
        });

        socket.on('gsmConnect',function(data){
            console.log(data.username + " connected to "+  data.room);
            if(data.room in rooms){
                socket.username = data.username;
                // store the room name in the socket session for this client
                socket.room = data.room;
                // join room
                socket.join(data.room);
                // add the client's username to the global list
                usernames[data.username] = data.username;
                console.log("gsm connect: " + rooms[socket.room]);
                if (io.sockets.connected[rooms[socket.room]]) {
                    io.sockets.connected[rooms[socket.room]].emit('updateusers', usernames);
                }
            }
        });

        var leaveRoom = function (){
            delete usernames[socket.username];
            socket.leave(socket.room);
            if (io.sockets.connected[socket.room]) {
                io.sockets.connected[socket.room].emit('updateusers', usernames);
            }
            console.log(socket.username + " has left "+  socket.room);
        };

        socket.on('gsmDisconnect',function(msg){
            leaveRoom();
        });

        socket.on('deviceOrientation', function(msg){
            console.log("device connected");
            if (io.sockets.connected[socket.room]) {
                msg.username=socket.username;
                io.sockets.connected[socket.room].emit('deviceOrientation', msg);
            }
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function(){
            if('username' in socket){
                leaveRoom();
            }else{
                delete rooms[socket.room];

            }
        });
    });
};