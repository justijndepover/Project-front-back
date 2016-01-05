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
    this.powerups = [];
    this.shield = false;
    this.shieldImage = new Image();
    this.shieldImage.src = "../assets/PNG/Effects/shield1.png";
    this.damageImage = new Image();
    this.image.src = '../assets/PNG/playerShip1_'+ this.color +'.png';
    this.explodeStage = -1;
};

Spaceship.prototype.reset = function (x, y, rotation) {
    this.speed = 1;
    this.damage = 0;
    this.damageImage = new Image();
    this.image.src = '../assets/PNG/playerShip1_'+ this.color +'.png';
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.shield = false;
    this.explodeStage = -1;
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
    if(degree>80){
        degree=80;
    }else if (degree<-80){
        degree = -80;
    }
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
    }else if(this.damage==4){
        this.explode();
    }
};

Spaceship.prototype.dead = function () {
    this.damage = 4;
    this.explode();
};

Spaceship.prototype.explode = function(){
    if(this.explodeStage <= 140){
        this.explodeStage ++;
        this.damageImage.src = "../assets/PNG/Damage/frame" + Math.floor(this.explodeStage/10) + ".gif";
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

Spaceship.prototype.addPowerup = function(powerup){
    switch(powerup.type){
        case 1:
            this.speed ++;
            this.powerups.push(powerup);
            break;
        case 2:
            this.shield = true;
            this.powerups.push(powerup);
            break;
        case 3:
            this.damage = 0;
            this.damageImage.src = "";
            break;
    }
};

Spaceship.prototype.checkPowerup = function(){
    for(var p in this.powerups){
        if(this.powerups[p].playerduration > 0){
            this.powerups[p].playerduration --;
        }else{
            switch(this.powerups[p].type){
                case 1:
                    this.speed --;
                    break;
                case 2:
                    this.shield = false;
                    break;
            }
            console.log(this.powerups);
            this.powerups.splice(p, 1);
            console.log(this.powerups);
        }
    }
};

