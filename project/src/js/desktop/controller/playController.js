/**
 * Created by Michiel on 16/12/2015.
 */
/**
 * Created by justijndepover on 16/12/15.
 */


(function(){
    "use strict";
    var playController = function($scope, socketService, displayService){
        $scope.PCShow = displayService.getPCShow;
        $scope.startGame = false;
    };

    angular.module("app").controller("playController", ["$scope", "socketService", "displayService", playController])
})();