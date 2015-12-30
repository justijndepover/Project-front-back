/**
 * Created by Michiel on 16/12/2015.
 */

(function(){
    "use strict";
    var playController = function($scope, $interval, $window, socketService, displayService, playerService){
        $scope.PCShow = displayService.getPCShow;
        $scope.startGame = false;
        var canv = document.getElementById('game');
        var ctx = canv.getContext('2d');

        var AllPlayers = new Array();
        var AllBullets = new Array();

        var cycle;

        socketService.on("initGame", function(){
            var BufferPlayer = playerService.getPlayers();
            for(var player in BufferPlayer){
                var p = BufferPlayer[player];
                AllPlayers.push(new Spaceship(p.username, p.x, p.y, p.color, p.rotation));
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
            var p = null;
            for(var i in AllPlayers){
                if(filterPlayers(AllPlayers[i],data) == true){
                    p = i;
                }
            }
            if(p != null){
                var temp = AllPlayers[p];
                var angle = (360 -(temp.rotation + 180))/180*Math.PI;
                var x = temp.x + (canv.width/400 * Math.sin(angle));
                var y = temp.y + (canv.width/400 * Math.cos(angle));
                AllBullets.push(new Bullet(x, y, temp.rotation, temp.color, temp.userName));
                if(p%2 == 0){
                    var shot = new Audio('../../assets/Bonus/sfx_laser1.ogg');
                }else{
                    var shot = new Audio('../../assets/Bonus/sfx_laser2.ogg');
                }
                shot.play();
            }
        });

        function filterPlayers(obj,data){
            if(data.username == obj.userName){
                return true;
            }else{
                return false;
            }
        }

        function draw(){
            if(AllPlayers.length>0){
                AllPlayers[0].speed = 0;
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

            checkBullets();

            collisionDetection();
        }

        function checkBullets(){

            for(var b in AllBullets){
                if(AllBullets[b].x < 0 || AllBullets[b].x > canv.width || AllBullets[b].y < 0 || AllBullets[b].y > canv.height){
                    AllBullets.splice(b, 1);
                }
                if(AllBullets[b].explodeStage >0) {
                    if (AllBullets[b].explodeStage < 4) {
                        AllBullets[b].explode();
                    } else {
                        AllBullets.splice(b, 1);
                    }
                }
            }
        }

        function collisionDetection(){
            for(var p in AllPlayers){
                for(var b in AllBullets){
                    if(AllBullets[b].explodeStage == 0) {
                        if (AllBullets[b].player != AllPlayers[p].userName) {
                            var radius = Math.sqrt(2) / 2 * (AllBullets[b].height / 2 - AllBullets[b].width / 2);
                            var angle = (360 - (AllBullets[b].rotation)) / 180 * Math.PI;
                            var bulletHeadX = (AllBullets[b].x * canv.width / 100 - (radius * Math.sin(angle)));
                            var bulletHeadY = (AllBullets[b].y * canv.width / 100 - (radius * Math.cos(angle)));

                            var spaceShipX = AllPlayers[p].x * canv.width / 100;
                            var spaceShipY = AllPlayers[p].y * canv.width / 100;

                            /*ctx.save();
                             ctx.beginPath();
                             ctx.arc(spaceShipX, spaceShipY, AllPlayers[p].width/2, 0, Math.PI*2);
                             ctx.lineWidth = 1;
                             ctx.strokeStyle = '#0000FF';
                             ctx.stroke();
                             ctx.restore();

                             ctx.save();
                             ctx.beginPath();
                             ctx.arc(bulletHeadX, bulletHeadY, AllBullets[b].width/2, 0, Math.PI*2);
                             ctx.lineWidth = 1;
                             ctx.strokeStyle = '#FF0000';
                             ctx.stroke();
                             ctx.restore();*/
                            var distance = Math.sqrt((bulletHeadX - spaceShipX) * (bulletHeadX - spaceShipX) + (bulletHeadY - spaceShipY) * (bulletHeadY - spaceShipY));
                            if (distance < (AllBullets[b].width / 2 + AllPlayers[p].width / 2)) {
                                var damagesound = new Audio('../../assets/Bonus/sfx_lose.ogg');
                                damagesound.play();
                                AllPlayers[p].increaseDamage();
                                AllBullets[b].explode();
                            }
                        }
                    }
                }
            }
        }
    };

    angular.module("app").controller("playController", ["$scope", "$interval", "$window", "socketService", "displayService", "playerService", playController])
})();