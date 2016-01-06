/**
 * Created by Michiel on 6/01/2016.
 */

var mongoose = require("mongoose");

UsersRepo = (function () {
    var Statistic = require("./statistic.js");

    var getAllStatistics = function (next) {
            Statistic.find({}).sort('createdOn').exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    next(err, null);
                }
                next(null, docs);
            });
        },

        createStatistic = function (statistic, next) {
            //single model command create combineert new en save
            //next combineert err & success
            //typeof(user) ==="object"
            statistic.createdOn = new Date();
            Statistic.create(statistic, function (err) {
                if (err) { return next(err); }
                next(statistic);
            });
        };

    return {
        model :Statistic ,
        getAllStatistics: getAllStatistics,
        createStatistic: createStatistic
    };
})();

module.exports = UsersRepo;