/**
 * Created by Michiel on 10/12/2015.
 */

var player = require('./data/models/player.js');
var room = require('./data/models/room.js');
var statisticsRepo = require("./data/models/statisticsRepo.js");
var Statistic = require("./data/models/statistic.js");

module.exports = function (io) {

    io.sockets.on('connection', function (socket) {
        socket.on('pcconnect',function(){
            var temp = new room(socket.id);
            temp.on('roomCreated', function(roomId){
                room.allRooms[temp.roomId] = temp;
                console.log("------------------------------------");
                console.log("new room is made: "+temp.roomId + ", with socketId: " + temp.socketId);
                console.log("++++++++++++++++++++++++++++++++++++");
                console.log("list with available rooms: ");
                console.log(room.allRooms);
                console.log("------------------------------------");
                if (io.sockets.connected[socket.id]) {
                    io.sockets.connected[socket.id].emit('requestRoom', roomId);
                }
            });
        });

        socket.on('gsmConnect',function(data){
            var message;
            if(data.room in room.allRooms) {
                var selectedRoom = room.allRooms[data.room];
                var userLength = selectedRoom.players.length;
                if (userLength < 4 && selectedRoom.canJoin === true){
                    data.username = data.username.toLowerCase();
                    selectedRoom.players.IsUserInArray(data.username,function (error, bool) {
                        if(bool === false){
                            console.log(data.username + " connected to " + data.room);

                            socket.username = data.username;
                            socket.room = data.room;
                            socket.join(data.room);

                            var p = new player(socket.id, data.username, selectedRoom.availableColors[0]);
                            selectedRoom.addUser(p);

                            message = "connectionEstablished";
                            if (io.sockets.connected[selectedRoom.socketId]) {
                                io.sockets.connected[selectedRoom.socketId].emit('updateusers', selectedRoom.players);
                            }
                            socket.emit("color", p.color);
                        }
                        else{
                            message = "usernameExist";
                        }
                    });
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
                selectedRoom.checkUser(socket.username, function (error, userexist) {
                    selectedRoom.deleteUser(socket.username);
                    socket.leave();
                    console.log(socket.username + " has left " + socket.room);
                    delete socket.username;
                    delete socket.room;
                });
                if (io.sockets.connected[selectedRoom.socketId]) {
                    io.sockets.connected[selectedRoom.socketId].emit('updateusers', selectedRoom.players);
                    if(room.allRooms[leaveRoom].canJoin === false){
                        io.sockets.connected[selectedRoom.socketId].emit('userleft',leaveUser );
                    }
                }
            }
        };
        
        socket.on("playerLife", function (data) {
            room.allRooms.selectRoomId(socket.id, function (error, roomid) {
                room.allRooms[roomid].selectUser(data.username, function (error, player) {
                    if (player !== null) {
                        if (io.sockets.connected[player.id]) {
                            io.sockets.connected[player.id].emit('life', data.life);
                        }
                    }
                });
            });
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
                room.allRooms.selectRoomId(socket.id, function (error, selectedRoomId) {
                    if(selectedRoomId !== null) {
                        socket.to(room.allRooms[selectedRoomId].roomId).emit("roomDisconnect", null);
                        console.log(room.allRooms[selectedRoomId].roomId + " room deleted");
                        delete room.allRooms[selectedRoomId];
                    }
                });

            }
        });

        socket.on("startGame", function (data) {
            room.allRooms.selectRoomId(socket.id, function (error, selectedRoomId) {
                var statisticObject = {roomName: "" + room.allRooms[selectedRoomId].roomId, playerCount:room.allRooms[selectedRoomId].players.length};//room.allRooms[selectedRoomId]
                statisticsRepo.createStatistic(statisticObject,function(next){
                    if (next.errors && next.name === 'ValidationError') {
                        var errString = Object.keys(next.errors).map(function (errField) {
                            return next.errors[errField].message;
                        }).join('<br />\n');
                        socket.emit("message", errString);
                    } else if (next.errors) {
                        next(new Error(next.message));
                    } else {
                        //2. indien geen errors
                        socket.to(room.allRooms[selectedRoomId].roomId).emit("message","startGame");
                        socket.emit("initGame", null);
                        room.allRooms[selectedRoomId].canJoin = false;
                    }
                });
            });

        });

        socket.on("endGame", function (username) {
            room.allRooms.selectRoomId(socket.id, function (error, roomId) {
                room.allRooms[roomId].selectUser(username, function (error, player) {
                    if(io.sockets.connected[player.id]) {
                        io.sockets.connected[player.id].emit("message", "winner");
                    }
                });
            });
        });

        socket.on("restartGame", function (data) {
            room.allRooms.selectRoomId(socket.id, function (error, selectedRoomId) {
                socket.to(room.allRooms[selectedRoomId].roomId).emit("message", "restartGame");
            });
        });
    });
};