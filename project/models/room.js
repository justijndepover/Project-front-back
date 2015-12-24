/**
 * Created by justijndepover on 17/12/15.
 */

var room = function(socketId){
    this.roomId = addRoom();
    this.socketId = socketId;
    this.canJoin = true;
    this.players = [];
};

function makeId(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function addRoom(){
    var roomId = makeId();
    if(room.allRooms.hasRoomInArray(roomId)){
        addRoom();
    }
    return roomId;
}

room.prototype.addUser = function(User){
    if(this.players.length < 4){
        this.players.push(User);
    }
};

room.prototype.deleteUser = function(username){
    for(var user in this.players){
        if(user.username = username){
            this.players.splice(username,1);
        }
    }
};

room.prototype.checkUser = function(username){
    for(var user in this.players){
        if(user.username = username){
            return true;
        }
    }
    return false;
};

room.allRooms = [];

module.exports = room;

Array.prototype.hasRoomInArray = function(roomId){
    var hasRoom = false;
    for(var tempRoom in room.allRooms){
        if(room.allRooms[tempRoom].roomId == roomId){
            hasRoom = true;
        }
    }
    return hasRoom;
};

Array.prototype.selectRoomId = function(socketId){
    var e = null;
    for(var tempRoom in room.allRooms){
        if(room.allRooms[tempRoom].socketId == socketId){
            e = room.allRooms[tempRoom].roomId;
        }
    }
    return e;
};