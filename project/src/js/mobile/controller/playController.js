/**
 * Created by justijndepover on 16/12/15.
 */


(function(){
    "use strict";
    var playController = function($scope, $rootScope, socketService, eventService, displayService){
        $scope.PCShow = displayService.getPCShow;
        $scope.showSettings = displayService.getSettingShow;
        $scope.life=3;
        $scope.getNumber = function(num) {
            return new Array(num);
        };
        $scope.color="blue";
        $scope.startGame = false;
        $scope.Settings = function(){
            var btn = document.getElementsByClassName('btnSettings')[0].children[0];
            if(btn.classList.contains('rotate')==true){
                displayService.setSettingShow(false);
                btn.setAttribute('class', 'rotateAnti');
            }else{
                displayService.setSettingShow(true);
                btn.setAttribute('class', 'rotate');
            }

        };
        $scope.shoot = function(){
            socketService.emit("playerShot", null);
        };

        var sendDeviceOrientation = function(eventData){
            var data = {};
            //data.gamma = eventData.gamma;
            data.beta = eventData.beta;
            //data.alpha = eventData.alpha;
            socketService.emit("deviceOrientation", data)
        };
        eventService.subscribeMe();
        $rootScope.$on('app.deviceorientationEvent', function(a, b) {
            sendDeviceOrientation(b);
        });

        $scope.leaveRoom = function(){
            socketService.emit("gsmDisconnect", null);
            displayService.setLCShow(true);
            displayService.setPCShow(false);
            displayService.setSettingShow(false);
        };

        socketService.on("message", function(message){
            console.log(message);
            if(message == "connectionEstablished"){
                $scope.text = "Waiting on other players";
                $scope.startGame = false;
            }else if(message == "startGame"){
                $scope.startGame = true;
            }
        });

        socketService.on("life",function(data){
            if(data==-1){
                $scope.text = "Game over";
                $scope.startGame=false;
            }else{
                $scope.life = data;
            }

        });
    };

    angular.module("app").controller("playController", ["$scope", "$rootScope", "socketService", "eventService", "displayService", playController])
})();