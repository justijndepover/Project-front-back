/**
 * Created by justijndepover on 16/12/15.
 */


(function(){

    var loginController = function($scope, socketService, displayService){
        $scope.LCShow = displayService.getLCShow;
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

        socketService.on("message", function(message){
            console.log("connectie");
            if(message == "connectionEstablished"){
                displayService.setPCShow(true);
                displayService.setLCShow(false);
            }
            else if(message == "connectionRefused"){
                $scope.text = "Something went wrong";
            }
        });
    };

    angular.module("app").controller("loginController", ["$scope", "socketService", "displayService", loginController]);
})();