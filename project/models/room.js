/**
 * Created by justijndepover on 17/12/15.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var room = function(socketId){
    var self = this;
    this.socketId = socketId;
    this.canJoin = true;
    this.players = [];
    addRoom(function (error, roomId) {
        self.roomId = roomId;
        self.emit('roomCreated',roomId);
    });
    this.availableColors=["blue", "red", "orange","green"];
};
util.inherits(room, EventEmitter);

function makeId(cb){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ ){
        (function (i) {
            setTimeout(function () {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
                if(i==4){
                    cb(null, text);
                }
            }, 0);
        })(i);
    }
}

function addRoom(cb){
    makeId(function (error, roomId) {
        room.allRooms.hasRoomInArray(roomId, function (error, roomInArray) {
            if(roomInArray===true){
                addRoom(cb);
            }else{
                cb(null, roomId);
            }
        });
    });
}

room.prototype.addUser = function(user){
    if(this.players.length < 4){
        this.players.push(user);
        this.availableColors.splice(user.color, 1);
    }
};

room.prototype.deleteUser = function(username) {
    var self = this;
    this.players.forEach(function (user) {
        if (user.username == username) {
            self.availableColors.push(user.color);
            self.players.splice(username, 1);
        }
    });
};

room.prototype.selectUser = function(username, cb){
    this.players.forEach(function (user) {
        if(user.username == username){
            cb(null, user);
        }
    });
};

room.prototype.checkUser = function(username, cb){
    this.players.forEach(function (user) {
        if(user.username == username){
            cb(null, true);
        }
    });
};

room.allRooms = [];

module.exports = room;

Array.prototype.hasRoomInArray = function(roomId, cb){
    var length = this.length;
    if(length===0){
        cb(null, false);
    }else{
        var roomInArray=false;
        var overlopen=0;
        var self = this;
        Object.keys(self).forEach(function (tempRoom) {
            overlopen++;
            if(self[tempRoom].roomId === roomId){
                roomInArray=true;
            }
            if(overlopen===length||roomInArray===true){
                cb(null, roomInArray);
            }
        });
    }
};

Array.prototype.selectRoomId = function(socketId, cb){
    console.log(this.length);
    console.log(typeof this);
    var self = this;
    Object.keys(self).forEach(function(tempRoom) {
        if(self[tempRoom].socketId === socketId){

            cb(null, self[tempRoom].roomId);
        }
    });
};