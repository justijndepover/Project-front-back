/**
 * Created by justijndepover on 17/12/15.
 */

(function(){
    var playerService = function(){
        //Login Controller
        var players = [];

        return{
            getPlayers: function(){
                return players;
            },
            setPlayers: function(playersArray){
                players = playersArray;
            }
        };
    };

    angular.module('app').factory('playerService', [playerService]);
})();