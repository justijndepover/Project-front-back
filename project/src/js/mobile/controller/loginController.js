/**
 * Created by justijndepover on 16/12/15.
 */


(function(){

    var loginController = function($scope, socketService){
        $scope.LCShow = true;
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
            console.log("join room");
            $scope.LCShow = false;
            $scope.PCShow = true;
            socketService.emit("gsmConnect", data);

        };
    };

    angular.module("app").controller("loginController", ["$scope", "socketService", loginController]);
})();