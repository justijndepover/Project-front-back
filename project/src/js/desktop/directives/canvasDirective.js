/**
 * Created by justijndepover on 16/12/15.
 */
(function(){
    var canvasDirective = function(){
        return{
            restrict: 'E',
            replace:true,
            template:'<canvas class="playArea" />'
        }
    };

    angular.module('app').directive("canvasDirective", [canvasDirective]);
})();