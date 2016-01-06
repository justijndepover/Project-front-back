/**
 * Created by Michiel on 6/01/2016.
 */

var mongoose = require('mongoose');

var StatisticSchema = new mongoose.Schema({
    roomName: { type: String },
    playerCount: { type: Number },
    createdOn: { type: Date, 'default': Date.now }
});

module.exports = StatisticSchema;