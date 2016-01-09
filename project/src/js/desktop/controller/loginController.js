/**
 * Created by Michiel on 11/12/2015.
 */

(function(){
    var loginController = function($scope, socketService, displayService, playerService){

        $scope.LCShow = displayService.getLCShow;

        //functions
        var makeRoom = function(){
            socketService.emit("pcconnect", null);
        };
        $scope.room = "";
        socketService.on('requestRoom',function(data){
            $scope.room = data;
        });
        socketService.on('deviceOrientation', function(data){
            var username = data.username;
            var deviceOrientation = {};
            deviceOrientation.gamma = data.gamma;
            deviceOrientation.beta = data.beta;
            deviceOrientation.alpha = data.alpha;
        });
        $scope.usernames = {};
        $scope.checkUserCount = true;
        socketService.on('updateusers', function (data) {
            playerService.setPlayers(data);
            $scope.usernames = data;
            $scope.checkUserCount = Object.keys($scope.usernames).length < 2;
        });

        $scope.startGame= function () {
            socketService.emit("startGame", null);
            displayService.setLCShow(false);
            displayService.setPCShow(true);
        };


        (function() {
            makeRoom();
        })();

    };

    angular.module("app").controller("loginController", ["$scope", "socketService" , "displayService", "playerService", loginController]);
})();