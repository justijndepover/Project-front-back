/**
 * Created by Michiel on 10/12/2015.
 */

var player = require('./models/player.js');
var room = require('./models/room.js');

module.exports = function (io) {

    io.sockets.on('connection', function (socket) {
        socket.on('pcconnect',function(){
            var temp = new room(socket.id);
            room.allRooms[temp.roomId] = temp;
            console.log("------------------------------------");
            console.log("new room is made: "+temp.roomId + ", with socketId: " + temp.socketId);
            console.log("++++++++++++++++++++++++++++++++++++");
            console.log("list with available rooms: ");
            console.log(room.allRooms);
            console.log("------------------------------------");
            if (io.sockets.connected[socket.id]) {
                io.sockets.connected[socket.id].emit('requestRoom', room.allRooms.selectRoomId(socket.id));
            }
        });

        socket.on('gsmConnect',function(data){
            var message;
            if(data.room in room.allRooms) {
                var selectedRoom = room.allRooms[data.room];
                var userLength = selectedRoom.players.length;
                if (userLength < 4 && selectedRoom.canJoin === true){
                    if(!(data.username in selectedRoom.players)) {
                        console.log(data.username + " connected to " + data.room);

                        socket.username = data.username;
                        socket.room = data.room;
                        socket.join(data.room);

                        var p = new player(socket.id, data.username);
                        selectedRoom.addUser(p);

                        message = "connectionEstablished";
                        if (io.sockets.connected[selectedRoom.socketId]) {
                            io.sockets.connected[selectedRoom.socketId].emit('updateusers', selectedRoom.players);
                        }
                    }
                    else{
                        message = "usernameExist";
                    }
                }
                else {
                    message = "roomFull";
                }
            }else {
                message = "connectionRefused";
            }
            socket.emit("message", message);
        });

        var leaveRoom = function (){
            var selectedRoom = room.allRooms[socket.room];
            var leaveUser=socket.username;
            var leaveRoom=socket.room;
            if(selectedRoom !== undefined){
                if(selectedRoom.checkUser(socket.username)){
                    selectedRoom.deleteUser(socket.username);
                    socket.leave();
                    console.log(socket.username + " has left " + socket.room);
                    delete socket.username;
                    delete socket.room;
                }
                if (io.sockets.connected[selectedRoom.socketId]) {
                    io.sockets.connected[selectedRoom.socketId].emit('updateusers', selectedRoom.players);
                    if(room.allRooms[leaveRoom].canJoin === false){
                        io.sockets.connected[selectedRoom.socketId].emit('userleft',leaveUser );
                        console.log(leaveUser);
                    }
                }
            }
        };
        
        socket.on("playerLife", function (data) {
            /*console.log("-------------------lol1-------------------------");
            console.log(socket.id);
            console.log("-------------------lol2-------------------------");
                console.log(room.allRooms);
            console.log("-------------------lol3-------------------------");
            //console.log(room.allRooms[socket.id]);
            console.log(room.allRooms[room.allRooms.selectRoomId(socket.id)])*/
                var player = room.allRooms[room.allRooms.selectRoomId(socket.id)].selectUser(data.username);
                console.log(player);
                console.log("-------------------hallo-------------------------");
                if (player !== null) {
                    console.log('damage1');
                    if (io.sockets.connected[player.id]) {
                        console.log('damage2');
                        io.sockets.connected[player.id].emit('life', data.life);
                    }
                }

        });

        //user presses leave-room button
        socket.on('gsmDisconnect',function(msg){
            leaveRoom();
        });

        socket.on('deviceOrientation', function(msg){
            if('room' in socket) {
                var selectedRoom = room.allRooms[socket.room];
                if (selectedRoom !== undefined) {
                    if (io.sockets.connected[selectedRoom.socketId]) {
                        var data = {};
                        data.username = socket.username;
                        data.orientation = msg.beta;
                        io.sockets.connected[selectedRoom.socketId].emit('updateGameData', data);
                    }
                }
            }
        });

        socket.on('playerShot', function(data){
            if('room' in socket) {
                var selectedRoom = room.allRooms[socket.room];
                if (selectedRoom !== undefined) {
                    if (io.sockets.connected[selectedRoom.socketId]) {
                        var data2 = {};
                        data2.username = socket.username;
                        io.sockets.connected[selectedRoom.socketId].emit('playerShot', data2);
                    }
                }
            }
        });

        socket.on('disconnect', function(){
            if('username' in socket){
                leaveRoom();
            }else{
                var selectedRoomId = room.allRooms.selectRoomId(socket.id);
                if(selectedRoomId !== null) {
                    socket.to(room.allRooms[selectedRoomId].roomId).emit("roomDisconnect", null);
                    delete room.allRooms[selectedRoomId];
                }
            }
        });

        socket.on("startGame", function (data) {
            var selectedRoomId = room.allRooms.selectRoomId(socket.id);
            socket.to(room.allRooms[selectedRoomId].roomId).emit("message","startGame");
            socket.emit("initGame", null);
            room.allRooms[selectedRoomId].canJoin = false;
        });

        socket.on("pauseGame", function (data) {

        });
    });
};