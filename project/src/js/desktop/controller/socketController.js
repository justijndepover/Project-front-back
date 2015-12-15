/**
 * Created by Michiel on 11/12/2015.
 */

(function(){
    var socketController = function($scope, socketService){

        //private

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
            $scope.usernames = data;
            if(Object.keys($scope.usernames).length < 4){
                $scope.checkUserCount = true;
            }else{
                $scope.checkUserCount = false;
            }
        });


        (function() {
            makeRoom();
        })();

    };

    angular.module("app").controller("socketController", ["$scope", "socketService", socketController]);
})();