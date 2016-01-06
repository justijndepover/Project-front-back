/**
 * Created by Michiel on 6/01/2016.
 */


var assert = require("assert");
var Player = require("../../data/models/player.js")

describe('player', function() {
    var players = [];
    beforeEach(function () {
        players.push(new Player("bdh4dqs5d", "Michiel","blue"));
        players.push(new Player("dsd4f5ds4", "Justijn","red"));
    });
    it('player exist in array', function(done) {
        assert.doesNotThrow(function() {
            players.IsUserInArray("Michiel", function (error, data) {
                assert.equal(data, true);
                done();
            });
        });
    });
});