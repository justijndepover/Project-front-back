/**
 * Created by justijndepover on 05/01/16.
 */


var Powerup = function(x, y, type, boolSelf){
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.type = type;
    this.duration = 1000;
    this.playerduration = 1000;
    var imageType;
    this.image = new Image();
    this.boolSelf = boolSelf;
    switch(type){
        case 1:
            imageType = "bolt_";
            break;
        case 2:
            imageType = "shield_";
            break;
        case 3:
            imageType = "star_";
            break;
    }

    switch(boolSelf){
        case 0:
            imageType += "gold.png";
            break;
        case 1:
            imageType += "silver.png";
    }
    this.image.src = "../assets/PNG/Power-ups/" + imageType;
};

Powerup.prototype.decreaseDuration = function(){
  if(this.duration > 0){
      this.duration --;
  }
};