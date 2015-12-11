/**
 * Created by Michiel on 11/12/2015.
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
    };

    angular.module("app").controller("socketController", ["$scope", "socketService", socketController]);

})();