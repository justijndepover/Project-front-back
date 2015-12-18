/**
 * Created by justijndepover on 16/12/15.
 */
(function(){
    var canvasDirective = function($window){
        return{
            restrict: 'E',
            link:link,
            replace:true,
            template:'<canvas class="playArea" width="{{width}}" height="{{width}}" />'
        };

        function link(scope, element, attrs){
            if($window.innerWidth < $window.innerHeight){
                scope.width = $window.innerWidth - 20;
            }else{
                scope.width = $window.innerHeight - 20;
            }

            angular.element($window).bind('resize', function(){
                if($window.innerWidth < $window.innerHeight){
                    scope.width = $window.innerWidth - 20;
                }else{
                    scope.width = $window.innerHeight - 20;
                }

                scope.$digest();
            });
        }
    };

    angular.module('app').directive("canvasDirective", ["$window", canvasDirective]);
})();