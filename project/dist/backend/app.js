/**
 * Created by justijndepover on 09/12/15.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

http.listen(3000);

// routing
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '/mobile/chat.html'));
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = {};

var pcs = {};

io.sockets.on('connection', function (socket) {

    socket.on('pcconnect',function(){
        rooms[socket.id]=socket.id;
        // store the room name in the socket session for this client
        socket.room = socket.id;
        // join room
        socket.join(socket.id);
    });

    socket.on('gsmconnect',function(data,calback){
        if(data.room in rooms){
            socket.username = data.username;
            // store the room name in the socket session for this client
            socket.room = data.room;
            // join room
            socket.join(data.room);
            // add the client's username to the global list
            usernames[username] = username;

            data.room.emit('updateusers', usernames);
            calback(null,'user toegevoegt');
        }
        else{
            calback('error', 'room bestaat niet');
        }
    });

    /*// when the client emits 'adduser', this listens and executes
     socket.on('adduser', function(username){
     // store the username in the socket session for this client
     socket.username = username;
     // store the room name in the socket session for this client
     socket.room = 'room1';
     // add the client's username to the global list
     usernames[username] = username;
     // send client to room 1
     socket.join('room1');
     // echo to client they've connected
     socket.emit('updatechat', 'SERVER', 'you have connected to room1');
     // echo to room 1 that a person has connected to their room
     socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
     socket.emit('updaterooms', rooms, 'room1');
     });

     // when the client emits 'sendchat', this listens and executes
     socket.on('sendchat', function (data) {
     // we tell the client to execute 'updatechat' with 2 parameters
     io.sockets.in(socket.room).emit('updatechat', socket.username, data);
     });

     socket.on('switchRoom', function(newroom){
     // leave the current room (stored in session)
     socket.leave(socket.room);
     // join new room, received as function parameter
     socket.join(newroom);
     socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
     // sent message to OLD room
     socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
     // update socket session room title
     socket.room = newroom;
     socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
     socket.emit('updaterooms', rooms, newroom);
     });*/

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        if('username' in socket){
            // remove the username from global usernames list
            delete usernames[socket.username];

            socket.leave(socket.room);
            socket.room.emit('updateusers', usernames);
        }else{
            delete rooms[socket.room];

        }


        /*// echo globally that this client has left
         socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
         socket.leave(socket.room);*/
    });
});