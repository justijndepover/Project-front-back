/**
 * Created by Michiel on 5/01/2016.
 */

describe("Spaceship", function () {
    var spaceship;

    beforeEach(function () {
       spaceship = new Spaceship("test", 10, 15, "blue", 120);
    });
    
    describe("properties", function () {
        it("should have a username", function () {
            expect(spaceship.userName).toBeDefined();
        });
        it("should have an x coördinate", function () {
            expect(spaceship.x).toBeDefined();
        });
        it("should have an y coördinate", function () {
            expect(spaceship.y).toBeDefined();
        });
        it("should have a speed", function () {
            expect(spaceship.speed).toBeDefined();
        });
        it("should have a color", function () {
            expect(spaceship.color).toBeDefined();
        });
        it("should have a rotation", function () {
            expect(spaceship.rotation).toBeDefined();
        });
        it("should have a image", function () {
            expect(spaceship.image).toBeDefined();
        });
        it("should have a damage", function () {
            expect(spaceship.damage).toBeDefined();
        });
        it("should have a width", function () {
            expect(spaceship.width).toBeDefined();
        });
        it("should have a height", function () {
            expect(spaceship.height).toBeDefined();
        });
        it("should have powerups", function () {
            expect(spaceship.powerups).toBeDefined();
        });
        it("should have a shield", function () {
            expect(spaceship.shield).toBeDefined();
        });
        it("should have a shieldImage", function () {
            expect(spaceship.shieldImage).toBeDefined();
        });
        it("should have a damageImage", function () {
            expect(spaceship.damageImage).toBeDefined();
        });
        it("should have an image", function () {
            expect(spaceship.image).toBeDefined();
        });
        it("should have an explodeStage", function () {
            expect(spaceship.explodeStage).toBeDefined();
        });
    });

    describe("when a spaceship is reset", function(){
        beforeEach(function () {
            spaceship.reset(1,20,120);
        });
        it("properties must have default value", function () {
            expect(spaceship.speed).toEqual(1);
            expect(spaceship.damage).toEqual(0);
            expect(spaceship.x).toEqual(1);
            expect(spaceship.y).toEqual(20);
            expect(spaceship.rotation).toEqual(120);
            expect(spaceship.shield).toEqual(false);
            expect(spaceship.explodeStage).toEqual(-1);
        });
    });

    describe("when you move a spaceship relative", function(){
        beforeEach(function () {
            spaceship.moveSpaceshipRelative(1,2);
        });
        it("x must be added to x and y must be added to y", function () {
            expect(spaceship.x).toEqual(11);
            expect(spaceship.y).toEqual(17);
        });
    });

    describe("when you move a spaceship", function(){
        beforeEach(function () {
            spaceship.rotateSpaceshipRelative(5);
        });
        it("given rotation must be added by rotation", function () {
            expect(spaceship.rotation).toEqual(121);
        });
    });
});