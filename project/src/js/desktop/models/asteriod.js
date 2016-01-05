/**
 * Created by justijndepover on 09/12/15.
 */


var Asteroid = function(x, y, rotation, stage){
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.rotation = rotation;
    this.stage = stage;
    this.image = new Image();
    this.image.src = ("../assets/PNG/Meteors/meteor_" + stage + ".png");
    this.speed = 1;
};

Asteroid.prototype.setImage = function(stage){
    this.stage = stage;
    this.image.src = ("../assets/PNG/Meteors/meteor_" + stage + ".png");
};