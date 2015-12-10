/**
 * Created by Michiel on 10/12/2015.
 */

module.exports = function (io ) {
    // usernames which are currently connected to the chat
    var usernames = {};

// rooms which are currently available in chat
    var rooms = {};
    rooms["hallo"]="hallo";

    var pcs = {};

    io.sockets.on('connection', function (socket) {
        socket.on('pcconnect',function(){
            rooms[socket.id]=socket.id;
            // store the room name in the socket session for this client
            socket.room = socket.id;
            // join room
            socket.join(socket.id);
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

                socket.to(data.room).emit('updateusers', usernames);
                calback(null,'user toegevoegt');
            }
            else{
                calback('error', 'room bestaat niet');
            }
        });

        socket.on('gsmDisconnect',function(msg){
            delete usernames[socket.username];
            socket.leave(socket.room);
            socket.to(room).emit('updateusers', usernames);

        });

        socket.on('deviceOrientation', function(msg){
            console.log("device connected");
            io.emit('deviceOrientation', msg);
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function(){
            if('username' in socket){
                // remove the username from global usernames list
                delete usernames[socket.username];

                socket.leave(socket.room);
                socket.to(socket.room).emit('updateusers', usernames);
            }else{
                delete rooms[socket.room];
            }
        });
    });
};