/**
 * Created by justijndepover on 16/12/15.
 */


(function(){
    var displayService = function(){
        //Login Controller
        var LCShow = true;
        //Play controller
        var PCShow = false;

        return{
            getLCShow: function(){
                return LCShow;
            },
            setLCShow: function(value){
                LCShow = value;
            },
            getPCShow: function(){
                return PCShow;
            },
            setPCShow: function(value){
                PCShow = value;
            }
        }
    };

    angular.module('app').factory('displayService', [displayService]);
})();