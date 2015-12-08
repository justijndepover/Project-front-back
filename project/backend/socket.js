/**
 * Created by Michiel on 3/12/2015.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require("path");

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '..', '/mobile/index.html'));
});

app.get('/sockettest.html', function(req, res){
    res.sendFile(path.join(__dirname, '..', '/src/sockettest.html'));
});
app.get('/canvasSocketTest.html', function(req, res){
    res.sendFile(path.join(__dirname, '..', '/src/canvasSocketTest.html'));
});

app.get('/img/testimg.png', function(req, res){
    res.sendFile(path.join(__dirname, '..', '/src/img/testimg.png'));
});

/*io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});*/

io.on('connection', function(socket){
    socket.on('deviceOrientation', function(msg){
        io.emit('deviceOrientation', msg);
    });

});

http.listen(3000, function(){
    console.log();
    console.log('listening on *:3000');
});