const mongoose = require("mongoose");

//schema set up
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

//build a model from Schema
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;