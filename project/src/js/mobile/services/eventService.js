/**
 * Created by Michiel on 16/12/2015.
 */
(function(){
    var eventService = function($rootScope,$window){
        function subsFunc() {
            $window.addEventListener('deviceorientation', function(e) {
                $rootScope.$broadcast('app.deviceorientationEvent', e);
            });
        }

        return {
            "subscribeMe": subsFunc
        };
    };
    angular.module("app").factory("eventService", ["$rootScope","$window", eventService]);
})();