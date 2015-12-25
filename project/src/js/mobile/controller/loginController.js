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
            switch(message){
                case "connectionEstablished":
                    displayService.setPCShow(true);
                    displayService.setLCShow(false);
                    break;
                case "connectionRefused":
                    $scope.text = "Something went wrong";
                    break;
                case "usernameExist":
                    $scope.text = "Username already exist";
                    break;
                case "roomFull" :
                    $scope.text = "Room is already full.";
                    break;
                default :
                    break;
            }
        });
    };

    angular.module("app").controller("loginController", ["$scope", "socketService", "displayService", loginController]);
})();