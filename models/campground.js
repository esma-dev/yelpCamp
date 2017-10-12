const mongoose = require("mongoose");
const Comment = require("./comment");

//schema set up
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

//build a model from Schema
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;