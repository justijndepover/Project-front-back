/**
 * Created by justijndepover on 17/12/15.
 */

var player = require('./models/player.js');

var room = function(id, socketId){
    this.id = id;
    this.socketId = socketId;
    this.canJoin = true;
    this.players = [];
};

function makeId(){
}

room.prototype.addUser = function(id, username){
    if(this.usernames.count >= 4){

    }else{
        var p = new player(id, username);
        this.usernames.push(p);
    }
};

room.prototype.deleteUser = function(username){
    this.usernames.pop(username);
};

module.exports = room;