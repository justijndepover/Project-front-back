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
    res.sendFile(path.join(__dirname, '..', '/mobile/index.html'));
});
app.get('/lib/angular/angular.js', function (req, res) {
    res.sendFile(path.join(__dirname, '../..', '/lib/angular/angular.js'));
});
app.get('/js/app.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '/mobile/js/app.min.js'));
});

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