/**
 * Created by justijndepover on 09/12/15.
 */

(function(){
    var socketController = function($scope, socketService){

        //private


        //functions
        var joinRoom = function(username, room){
            var data = {};
            data.username = username;
            data.room = room;
            socketService.emit("gsmConnect", data);
        };

        var leaveRoom = function(){
            socketService.emit("gsmDisconnect", null);
        };

        var sendDeviceOrientation = function(eventData){
            var data = {};
            data.gamma = eventData.gamma;
            data.beta = eventData.beta;
            data.delta = eventData.delta;
            socketService.emit("deviceOrientation", data)
        };

        var test = function(){};

        //public
        return{
            joinRoom: joinRoom,
            leaveRoom: leaveRoom,
            sendDeviceOrientation: sendDeviceOrientation
        }
    };

    angular.module("app").controller("socketController", ["$scope", "socketService", socketController]);

})();