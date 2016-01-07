/**
 * Created by Michiel on 7/01/2016.
 */

var assert = require("assert");
var Room = require("../../data/models/room.js");
var Player = require("../../data/models/player.js");

describe('room', function() {

    beforeEach(function () {
        Room.allRooms.push(new Room("8411473621394412707"));
        Room.allRooms.push(new Room("1120516437992682114"));
    });
    it('should add a user', function(done) {
        assert.doesNotThrow(function() {
            Room.allRooms[0].addUser(new Player("bdh4dqs5d", "Michiel","blue"));
            assert.equal(Room.allRooms[0].players[0].username, "Michiel");
            done();
        });
    });
    it('should delete a user', function(done) {
        assert.doesNotThrow(function() {
            assert.equal(Room.allRooms[0].players[0].username, "Michiel");
            Room.allRooms[0].deleteUser("Michiel");
            assert.equal(Room.allRooms[0].players[0], undefined);
            done();
        });
    });
    it('should select a user by username', function (done) {
        assert.doesNotThrow(function() {
            Room.allRooms[0].addUser(new Player("bdh4dqs5d", "Michiel","blue"));
            Room.allRooms[0].selectUser("Michiel", function(error, user){
                assert.equal(user.username, "Michiel");
                done();
            });
        });
    });
    it('should be possible to check is user exist in room', function (done) {
        assert.doesNotThrow(function () {
            Room.allRooms[0].checkUser("Michiel", function(error, data){
                assert.equal(data, true);
                done();
            });
        });
    });

});