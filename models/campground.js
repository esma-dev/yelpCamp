const mongoose = require("mongoose");
const Comment = require("./comment");

//schema set up
const campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: {
		type: Date,
		default: Date.now
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
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