/**
 * Created by Michiel on 10/12/2015.
 */

module.exports = function (io ) {
    // usernames which are currently connected to the chat
    var usernames = {};

// rooms which are currently available in chat
    var rooms = {};

    var pcs = {};

    io.sockets.on('connection', function (socket) {
        socket.on('pcconnect',function(){
            console.log("new room is made: "+socket.id);
            rooms[socket.id]=socket.id;
            // store the room name in the socket session for this client
            socket.room = socket.id;
            // join room
            socket.join(socket.id);
            if (io.sockets.connected[socket.id]) {
                io.sockets.connected[socket.id].emit('requestRoom', socket.id);
            }
        });

        socket.on('gsmConnect',function(data,calback){
            console.log(data.username + " connected to "+  data.room);
            if(data.room in rooms){
                socket.username = data.username;
                // store the room name in the socket session for this client
                socket.room = data.room;
                // join room
                socket.join(data.room);
                // add the client's username to the global list
                usernames[data.username] = data.username;
                if (io.sockets.connected[socket.room]) {
                    io.sockets.connected[socket.room].emit('updateusers', usernames);
                }
                calback(null,'user toegevoegt');
            }
            else{
                calback('error', 'room bestaat niet');
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