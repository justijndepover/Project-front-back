/**
 * Created by justijndepover on 17/12/15.
 */

var player = function(id,username,color){
    this.id = id;
    this.username = username;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.color = color;
};

Array.prototype.IsUserInArray = function (username,cb) {
    var arrLength = this.length;
    if(arrLength!==0){
        var teller = 0;
        var userInArray = false;
        this.forEach(function (u) {
            teller++;
            if(username === u.username){
               userInArray=true;
            }
            if(teller === arrLength){
                cb(null, userInArray);
            }
        });
    }
    else{
        cb(null, false)
    }
};

module.exports = player;