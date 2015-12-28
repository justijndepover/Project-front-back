/**
 * Created by justijndepover on 22/12/15.
 */

var Bullet = function(x, y,rotation, color, player){
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.image = new Image();
    this.color = color;
    this.width = 0;
    this.height = 0;
    this.player = player;
    if(this.color == "orange"){
        this.color = 'red';
    }
    this.image.src = '../assets/PNG/Lasers/laser'+ this.color.charAt(0).toUpperCase() + this.color.slice(1) +'01.png'
};