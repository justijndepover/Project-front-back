/**
 * Created by justijndepover on 16/12/15.
 */


(function(){
    "use strict";
    var playController = function($scope, $rootScope, socketService, eventService){
        $scope.PCShow = false;

        $scope.shoot = function(){

        };

        var sendDeviceOrientation = function(eventData){
            var data = {};
            data.gamma = eventData.gamma;
            data.beta = eventData.beta;
            data.alpha = eventData.alpha;
            socketService.emit("deviceOrientation", data)
        };
        eventService.subscribeMe();
        $rootScope.$on('app.deviceorientationEvent', function(a, b) {
            sendDeviceOrientation(b);
        });

        $scope.leaveRoom = function(){
            socketService.emit("gsmDisconnect", null);
        };
    };

    angular.module("app").controller("playController", ["$scope", "$rootScope", "socketService", "eventService", playController])
})();