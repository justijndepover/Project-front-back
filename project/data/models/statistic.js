/**
 * Created by Michiel on 6/01/2016.
 */

var mongoose = require("mongoose");
var StatisticSchema = require("../schemas/statistic");

var Statistic = mongoose.model('Statistic', StatisticSchema, "statistics");  //model-schema-collection
//default collection = model + "s"

//Dataaccessors met callbacks => in repositorynp
module.exports = Statistic;