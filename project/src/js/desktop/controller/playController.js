/**
 * Created by Michiel on 16/12/2015.
 */

(function(){
    "use strict";
    var playController = function($scope, $interval, $window, socketService, displayService, playerService){
        var defaultVars = [{x:10, y:10,rotation:135},{x:90, y:10,rotation:225},{x:90, y:90,rotation:315},{x:10, y:90,rotation:45}];
        $scope.PCShow = displayService.getPCShow;
        $scope.endGame = false;
        var canv = document.getElementById('game');
        var ctx = canv.getContext('2d');

        var AllPlayers = new Array();
        var AllBullets = new Array();
        var AllAsteroids = new Array();

        var cycle;

        socketService.on("initGame", function(){
            var BufferPlayer = playerService.getPlayers();
            var teller= 0;
            for(var player in BufferPlayer){
                var p = BufferPlayer[player];
                AllPlayers.push(new Spaceship(p.username, defaultVars[teller].x, defaultVars[teller].y, p.color, defaultVars[teller].rotation));
                teller++;
            }

            for(var i = 0; i<10; i++){
                AllAsteroids.push(new Asteroid(Math.floor(Math.random()*100), Math.floor(Math.random()*100), Math.floor(Math.random()*361), Math.ceil(Math.random()*20)));
            }


            cycle = $interval(draw, 10);
        });

        socketService.on("userleft", function (data) {
            var p = null;
            for(var i in AllPlayers){
                if(filterPlayers(AllPlayers[i],data) == true){
                    p = i;
                }
            }
            AllPlayers.splice(p,1);
        });

        socketService.on("updateGameData", function(data){
            var p = null;
            for(var i in AllPlayers){
                if(filterPlayers(AllPlayers[i],data) == true){
                    p = i;
                }
            }
            if(p != null){
                AllPlayers[p].rotateSpaceshipRelative(data.orientation);
            }
        });

        socketService.on("playerShot", function(data){
            if($scope.endGame==false) {
                var p = null;
                for (var i in AllPlayers) {
                    if (filterPlayers(AllPlayers[i], data) == true) {
                        p = i;
                    }
                }
                if (p != null) {
                    var temp = AllPlayers[p];
                    var angle = (360 - (temp.rotation + 180)) / 180 * Math.PI;
                    var x = temp.x + (canv.width / 400 * Math.sin(angle));
                    var y = temp.y + (canv.width / 400 * Math.cos(angle));
                    AllBullets.push(new Bullet(x, y, temp.rotation, temp.color, temp.userName));
                    var audioUrl = '../../assets/Bonus/sfx_laser2.ogg';
                    if (p % 2 == 0) {
                        audioUrl = '../../assets/Bonus/sfx_laser1.ogg';
                    }
                    var shot = new Audio(audioUrl);
                    shot.play();
                }
            }
        });

        function filterPlayers(obj,data){
            return data.username == obj.userName;
        }

        function draw(){
            if(AllPlayers.length>0){
                //AllPlayers[0].speed = 0;
                //AllPlayers[1].speed = 0;
            }
            ctx.clearRect(0,0,canv.width, canv.height);
            var ratio = canv.width/100;

            if(AllBullets.length != 0){
                var BulletWidth = canv.width/100;
                var BulletHeight = BulletWidth * AllBullets[0].image.height/AllBullets[0].image.width;

                for(var bullet in AllBullets){
                    var b = AllBullets[bullet];
                    b.width = BulletWidth;
                    b.height = BulletHeight;

                    if(b.explodeStage == 0){
                        //Draw bullet
                        ctx.save();
                        ctx.translate(b.x*ratio, b.y*ratio);
                        ctx.rotate(b.rotation/180*Math.PI);
                        ctx.drawImage(b.image, -BulletWidth/2, -BulletHeight/2, BulletWidth, BulletHeight);
                        ctx.restore();

                        AllBullets[bullet].x = Math.cos((b.rotation - 90)/180*Math.PI) + b.x;
                        AllBullets[bullet].y = Math.sin((b.rotation - 90)/180*Math.PI)+ b.y;
                    }else if(b.explodeStage < 4){
                        //Draw explosion
                        console.log(b.explosionImage);
                        ctx.save();
                        ctx.translate(b.x*ratio, b.y*ratio);
                        ctx.drawImage(b.explosionImage, -BulletWidth, -BulletWidth, BulletWidth*2, BulletWidth*2);
                        ctx.restore();
                    }
                }
            }

            if(AllPlayers.length != 0){
                var SpaceshipWidth = canv.width/20;
                var SpaceshipHeight = SpaceshipWidth * AllPlayers[0].image.height/ AllPlayers[0].image.width;

                for(var player in AllPlayers){
                    var p = AllPlayers[player];
                    p.width = SpaceshipWidth;
                    p.height = SpaceshipHeight;
                    ctx.save();
                    ctx.translate(p.x*ratio, p.y*ratio);
                    ctx.rotate(p.rotation/180*Math.PI);
                    ctx.drawImage(p.image, -SpaceshipWidth/2, -SpaceshipHeight/2, SpaceshipWidth, SpaceshipHeight);
                    if(p.damage > 0){
                        ctx.drawImage(p.damageImage, -SpaceshipWidth/2, -SpaceshipHeight/2, SpaceshipWidth, SpaceshipHeight);
                    }
                    ctx.restore();
                    AllPlayers[player].x = Math.cos((p.rotation - 90)/180*Math.PI)/10* p.speed + p.x;
                    AllPlayers[player].y = Math.sin((p.rotation - 90)/180*Math.PI)/10* p.speed + p.y;
                }
            }

            if(AllAsteroids.length>0){
                for(var Asteroid in AllAsteroids){
                    var a = AllAsteroids[Asteroid];
                    a.width = canv.width/1500* a.image.width;
                    a.height = a.width* a.image.height/ a.image.width;
                    ctx.save();
                    ctx.translate(a.x*ratio, a.y*ratio);
                    ctx.rotate(a.rotation/180*Math.PI);
                    ctx.drawImage(a.image, -a.width/2, -a.height/2, a.width, a.height);
                    ctx.restore();
                    if(a.x < -5 || a.x > 105 || a.y < -5 || a.y > 105){
                        //nieuwe asteroid tekenen
                        var keuze = Math.random();
                        if(keuze < 0.25){
                            //links
                            AllAsteroids[Asteroid].x = -4;
                            AllAsteroids[Asteroid].y = Math.floor(Math.random()*100);
                            AllAsteroids[Asteroid].rotation = Math.floor(Math.random()*180);
                            AllAsteroids[Asteroid].setImage(Math.ceil(Math.random()*20));
                        }else if(keuze < 0.5){
                            //boven
                            AllAsteroids[Asteroid].x = Math.floor(Math.random()*100);
                            AllAsteroids[Asteroid].y = -4;
                            AllAsteroids[Asteroid].rotation = Math.floor(Math.random()*180) + 90;
                            AllAsteroids[Asteroid].setImage(Math.ceil(Math.random()*20));
                        }else if(keuze < 0.75){
                            //rechts
                            AllAsteroids[Asteroid].x = 104;
                            AllAsteroids[Asteroid].y = Math.floor(Math.random()*100);
                            AllAsteroids[Asteroid].rotation = Math.floor(Math.random()*180) + 180;
                            AllAsteroids[Asteroid].setImage(Math.ceil(Math.random()*20));
                        }else{
                            //onder
                            AllAsteroids[Asteroid].x = Math.floor(Math.random()*100);
                            AllAsteroids[Asteroid].y = 104;
                            AllAsteroids[Asteroid].rotation = Math.floor(Math.random()*180) + 270;
                            AllAsteroids[Asteroid].setImage(Math.ceil(Math.random()*20));
                        }

                    }else{
                        AllAsteroids[Asteroid].x = Math.cos((a.rotation - 90)/180*Math.PI)/30 + a.x;
                        AllAsteroids[Asteroid].y = Math.sin((a.rotation - 90)/180*Math.PI)/30 + a.y;
                    }
                }
            }

            checkBullets();

            collisionDetection();
        }

        function checkBullets(){
            for(var b in AllBullets){
                if(AllBullets[b].x < 0 || AllBullets[b].x > canv.width || AllBullets[b].y < 0 || AllBullets[b].y > canv.height){
                    AllBullets.splice(b, 1);
                }else if(AllBullets[b].explodeStage >0) {
                    if (AllBullets[b].explodeStage < 4) {
                        AllBullets[b].explode();
                    } else {
                        AllBullets.splice(b, 1);
                    }
                }
            }
        }

        function collisionDetection(){
            //Player - Bullet
            var livingPlayers=[];
            for(var p in AllPlayers){
                if(AllPlayers[p].damage<4){
                    livingPlayers.push(AllPlayers[p]);
                }
                for(var b in AllBullets){
                    if(AllBullets[b].explodeStage == 0) {
                        if (AllBullets[b].player != AllPlayers[p].userName) {
                            var radius = Math.sqrt(2) / 2 * (AllBullets[b].height / 2 - AllBullets[b].width / 2);
                            var angle = (360 - (AllBullets[b].rotation)) / 180 * Math.PI;
                            var bulletHeadX = (AllBullets[b].x * canv.width / 100 - (radius * Math.sin(angle)));
                            var bulletHeadY = (AllBullets[b].y * canv.width / 100 - (radius * Math.cos(angle)));

                            var spaceShipX = AllPlayers[p].x * canv.width / 100;
                            var spaceShipY = AllPlayers[p].y * canv.width / 100;

                            var distance = Math.sqrt((bulletHeadX - spaceShipX) * (bulletHeadX - spaceShipX) + (bulletHeadY - spaceShipY) * (bulletHeadY - spaceShipY));
                            if (distance < (AllBullets[b].width / 2 + AllPlayers[p].width / 2)) {
                                var damagesound = new Audio('../../assets/Bonus/sfx_lose.ogg');
                                damagesound.play();
                                AllPlayers[p].increaseDamage();
                                var data = {};
                                data.username = AllPlayers[p].userName;
                                data.life = 3-AllPlayers[p].damage;
                                socketService.emit("playerLife",data);
                                AllBullets[b].explode();
                            }
                        }
                    }
                }
                //Player - Asteroid
                for(var a in AllAsteroids){
                    var asteroidX = AllAsteroids[a].x * canv.width / 100;
                    var asteroidY = AllAsteroids[a].y * canv.width / 100;

                    var spaceShipX = AllPlayers[p].x * canv.width / 100;
                    var spaceShipY = AllPlayers[p].y * canv.width / 100;

                    var distance = Math.sqrt((asteroidX - spaceShipX) * (asteroidX - spaceShipX) + (asteroidY - spaceShipY) * (asteroidY - spaceShipY));
                    if (distance < (AllAsteroids[a].width / 2 + AllPlayers[p].width / 2)) {
                        var damagesound = new Audio('../../assets/Bonus/sfx_lose.ogg');
                        damagesound.play();
                        AllPlayers[p].increaseDamage();
                        var data = {};
                        data.username = AllPlayers[p].userName;
                        data.life = 3-AllPlayers[p].damage;
                        socketService.emit("playerLife",data);
                        AllBullets[b].explode();
                    }
                }

                //Player - Player

            }




            //Bullet - Asteroid


            if(livingPlayers.length==1){
                endGame(livingPlayers);
            }
        }

        function endGame(livingPlayers){
            if (angular.isDefined(cycle)) {
                $interval.cancel(cycle);
                cycle = undefined;
            }
            $scope.endGame=true;
            $scope.endGameText= livingPlayers[0].userName + " is the winner!"
            socketService.emit("endGame", livingPlayers[0].userName);
        }
        $scope.restartGame = function(){
            $scope.endGame=false;
            var teller=0;
            for(var p in AllPlayers){
                AllPlayers[p].reset(defaultVars[teller].x,defaultVars[teller].y,defaultVars[teller].rotation);
                teller++;
            }
            ctx.clearRect(0,0,canv.width, canv.height);
            socketService.emit("restartGame",null);
            cycle = $interval(draw, 10);
        };
    };

    angular.module("app").controller("playController", ["$scope", "$interval", "$window", "socketService", "displayService", "playerService", playController])
})();