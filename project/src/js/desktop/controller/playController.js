/**
 * Created by Michiel on 16/12/2015.
 */

(function(){
    "use strict";
    var playController = function($scope, $window, socketService, displayService, playerService){
        $scope.PCShow = displayService.getPCShow;
        $scope.startGame = false;

        socketService.on("gameCycle", function(data){

        });

    };

    angular.module("app").controller("playController", ["$scope", "$window", "socketService", "displayService", "playerService", playController])
})();