/**
 * Created by Michiel on 3/12/2015.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
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
    console.log('listening on *:3000');
});