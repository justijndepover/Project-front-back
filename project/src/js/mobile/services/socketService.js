/**
 * Created by justijndepover on 09/12/15.
 */

(function(){
    var socketService = function($scope){
        "use strict";
        //private
        var socket = io.connect(window.location.host);

        //functions
        var on = function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $scope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            };

        var emit = function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $scope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        };

        //public
        return{
            on: on,
            emit: emit
        }
    };

    angular.module("app").factory("socketService", ["$scope", socketService]);
})();
