/**
 * Created by justijndepover on 09/12/15.
 */

(function(){
    var socketController = function($scope, socketService){

        //private


        //functions
        $scope.joinRoom = function(username, room){
            var data = {};
            data.username = username;
            data.room = room;
            socketService.emit("gsmConnect", data);
        };

        $scope.leaveRoom = function(){
            socketService.emit("gsmDisconnect", null);
        }

        var sendDeviceOrientation = function(eventData){
            var data = {};
            data.gamma = eventData.gamma;
            data.beta = eventData.beta;
            data.delta = eventData.delta;
            socketService.emit("deviceOrientation", data)
        };
        return{
            sendDeviceOrientation: sendDeviceOrientation
        }
    };

    angular.module("app").controller("socketController", ["$scope", "socketService", socketController]);

})();