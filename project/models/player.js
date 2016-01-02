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

module.exports = player;