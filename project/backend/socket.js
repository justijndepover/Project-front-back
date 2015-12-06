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
    socket.on('moAccel', function(msg){
        io.emit('moAccel', msg);
    });
    socket.on('moAccelGrav', function(msg){
        io.emit('moAccelGrav', msg);
    });
    socket.on('moRotation', function(msg){
        io.emit('moRotation', msg);
    });
    socket.on('moInterval', function(msg){
        io.emit('moInterval', msg);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});