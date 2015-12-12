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
        socketService.on('requestRoom',function(data){
            $scope.room = data;
        });
        (function() {
            makeRoom();
        })();

    };

    angular.module("app").controller("socketController", ["$scope", "socketService", socketController]);

})();