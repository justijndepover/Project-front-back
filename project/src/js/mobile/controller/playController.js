/**
 * Created by justijndepover on 16/12/15.
 */


(function(){
    "use strict";
    var playController = function($scope, $rootScope, socketService, eventService, displayService){
        $scope.PCShow = displayService.getPCShow;
        $scope.startGame = false;
        $scope.shoot = function(){

        };

        var sendDeviceOrientation = function(eventData){
            var data = {};
            data.gamma = eventData.gamma;
            data.beta = eventData.beta;
            data.alpha = eventData.alpha;
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
        };

        socketService.on("message", function(message){
            if(message == "connectionEstablished"){
                $scope.text = "Waiting on other players";
                $scope.startGame = false;
            }else if(message == "startGame"){
                $scope.startGame = true;
            }
        });
    };

    angular.module("app").controller("playController", ["$scope", "$rootScope", "socketService", "eventService", "displayService", playController])
})();