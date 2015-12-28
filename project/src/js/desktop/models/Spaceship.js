/**
 * Created by justijndepover on 09/12/15.
 */

var Spaceship = function(userName, x, y, color, rotation){
    this.userName = userName;
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.color = color;
    this.rotation = rotation;
    this.image = new Image();
    this.damage = 0;
    this.width = 0;
    this.height = 0;
    this.damageImage = new Image();
    this.image.src = '../assets/PNG/playerShip1_'+ this.color +'.png'
};

Spaceship.prototype.moveSpaceship = function(x, y){
    this.x = x;
    this.y = y;
};

Spaceship.prototype.moveSpaceshipRelative = function(x, y){
    this.x = this.x+x;
    this.y = this.y+y;
};

Spaceship.prototype.rotateSpaceship = function(degree){
    this.rotation = degree;
};

Spaceship.prototype.rotateSpaceshipRelative = function(degree){
    this.rotation = this.rotation + degree/5;
    if(this.rotation < -360){
        this.rotation = this.rotation + 720;
    }
    if(this.rotation > 360){
        this.rotation = this.rotation - 720;
    }
};

Spaceship.prototype.increaseDamage = function(){
    if(this.damage < 4){
        this.damage += 1;
    }

    if(this.damage <= 3 && this.damage > 0){
        this.damageImage.src = '../assets/PNG/Damage/playerShip1_damage'+ this.damage + '.png';
    }
};

Spaceship.prototype.decreaseDamage = function(){
    if(this.damage > 0){
        this.damage -= 1;
    }

    if(this.damage <= 3 && this.damage > 0){
        this.damageImage.src = '../assets/PNG/Damage/playerShip1_damage'+ this.damage + '.png';
    }
};

