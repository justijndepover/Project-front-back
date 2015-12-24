/**
 * Created by justijndepover on 17/12/15.
 */

var player = function(username){
    this.username = username;
    this.x = Math.floor(Math.random() * 100);
    this.y = Math.floor(Math.random() * 100);
    this.rotation = Math.floor(Math.random() * 360);
    this.color = "blue";
};

module.exports = player;