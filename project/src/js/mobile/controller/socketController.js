/**
 * Created by justijndepover on 09/12/15.
 */

(function(){
    var socketController = function($scope, $rootScope, socketService, eventService){

        //private


        //functions
        socketService.on("startGame", function (data) {
            console.log("start game");
        });
        socketService.on("roomDisconnect", function (data) {

        });
        
        $scope.joinRoom = function(username, room){
            var data = {};
            data.username = username;
            data.room = room.toUpperCase();
            socketService.emit("gsmConnect", data);
        };

        $scope.leaveRoom = function(){
            socketService.emit("gsmDisconnect", null);
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
        return{
            sendDeviceOrientation: sendDeviceOrientation
        }
    };

    angular.module("app").controller("socketController", ["$scope", "$rootScope", "socketService", "eventService", socketController]);

})();