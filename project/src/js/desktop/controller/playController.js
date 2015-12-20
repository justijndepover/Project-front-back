/**
 * Created by Michiel on 16/12/2015.
 */

(function(){
    "use strict";
    var playController = function($scope, $window, socketService, displayService, playerService){
        $scope.PCShow = displayService.getPCShow;
        $scope.startGame = false;
        var canv = document.getElementById('game');
        var ctx = canv.getContext('2d');

        socketService.on("gameCycle", function(){
            var players = playerService.getPlayers();
            var i = false;
            var ratio = canv.width/100;
            for(var user in players){
                var imageObj = new Image();
                imageObj.user=players[user];
                imageObj.onload = function() {
                    ctx.rotate(this.user.rotation*Math.PI/180);
                    ctx.drawImage(this, this.user.posX*ratio, this.user.posY*ratio);
                    ctx.rotate(-(this.user.rotation*Math.PI/180));
                };
                imageObj.src = '../assets/PNG/playerShip1_'+players[user].color+'.png';
            }
        });

    };

    angular.module("app").controller("playController", ["$scope", "$window", "socketService", "displayService", "playerService", playController])
})();