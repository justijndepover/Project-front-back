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
                //var x  = Math.sin((temp.rotation - 90)/180*Math.PI)+temp.x;
                //var y = Math.cos((temp.rotation - 90)/180*Math.PI)+temp.y;
                AllBullets.push(new Bullet(temp.x, temp.y, temp.rotation, temp.color, temp.userName));
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
            ctx.clearRect(0,0,canv.width, canv.height);
            var ratio = canv.width/100;

            if(AllBullets.length != 0){
                var BulletWidth = canv.width/100;
                var BulletHeight = BulletWidth * AllBullets[0].image.height/AllBullets[0].image.width;

                for(var bullet in AllBullets){
                    var b = AllBullets[bullet];
                    b.width = BulletWidth;
                    b.height = BulletHeight;
                    ctx.save();
                    ctx.translate(b.x*ratio, b.y*ratio);
                    ctx.rotate(b.rotation/180*Math.PI);
                    ctx.drawImage(b.image, -BulletWidth/2, -BulletHeight/2, BulletWidth, BulletHeight);
                    ctx.restore();
                    AllBullets[bullet].x = Math.cos((b.rotation - 90)/180*Math.PI) + b.x;
                    AllBullets[bullet].y = Math.sin((b.rotation - 90)/180*Math.PI)+ b.y;
                }
            }

            if(AllPlayers.length != 0){
                AllPlayers[1].speed = 0;
                AllPlayers[0].speed = 0;
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

            }
        }

        function collisionDetection(){
            for(var p in AllPlayers){
                for(var b in AllBullets){
                    if(AllBullets[b].player != AllPlayers[p].userName){
                        var radius = Math.sqrt(2)/2*AllBullets[b].width/2;
                        var angle = ((360 -(AllBullets[b].rotation - 90)) - 90)/180*Math.PI;
                        var bulletHeadX = AllBullets[b].x + (radius * Math.sin(angle));
                        var bulletHeadY = AllBullets[b].y + (radius * Math.cos(angle));

                        var radiusS = Math.sqrt(2)/2*AllPlayers[p].height/2;
                        var angleS = ((360 -(AllPlayers[p].rotation - 90)) - 90)/180*Math.PI;
                        var bulletHeadXS = AllPlayers[p].x + (radiusS * Math.sin(angleS));
                        var bulletHeadYS = AllPlayers[p].y + (radiusS * Math.cos(angleS));

                        var distance = Math.sqrt(Math.pow((bulletHeadX-bulletHeadXS), 2) + Math.pow((bulletHeadY-bulletHeadYS), 2))
                        if(distance < (radius + radiusS)){
                            AllPlayers[p].increaseDamage()
                            AllBullets.splice(b, 1);
                        }
                    }
                }
            }
        }
    };

    angular.module("app").controller("playController", ["$scope", "$interval", "$window", "socketService", "displayService", "playerService", playController])
})();