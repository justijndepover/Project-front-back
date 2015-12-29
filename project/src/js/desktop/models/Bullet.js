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
    this.explosionImage = new Image();
    this.shieldImage = new Image();
    shieldImage.src = 
    this.explodeStage = 0;
    if(this.color == "orange"){
        this.color = 'red';
    }
    this.image.src = '../assets/PNG/Lasers/laser'+ this.color.charAt(0).toUpperCase() + this.color.slice(1) +'01.png'
};

Bullet.prototype.explode = function(){
    if(this.explodeStage < 4){
        this.explodeStage++;
        var number;
        if(this.explodeStage < 3){
           number = 1
        }else{
            number = 2
        }
        this.explosionImage.src = '../assets/PNG/Lasers/laser' + this.color.charAt(0).toUpperCase() + this.color.slice(1) + 'Explode'+ number +'.png';
    }else{
        this.explosionImage.src = '';
    }
};
