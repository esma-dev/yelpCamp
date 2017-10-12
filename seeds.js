//create a bunch of campgrounds
//plus a few comments for each campground

const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
	{
		name: "Salt Lake Creek",
		image: "https://farm5.staticflickr.com/4470/36723988354_ee2085f197.jpg",
		description: "Beautiful Majestic Scenery. No bathrooms."
	},
	{
		name: "Fall Heights",
		image: "https://farm6.staticflickr.com/5059/5518252117_d232831997.jpg",
		description: "Beautiful Majestic Scenery. No bathrooms."
	},
	{
		name: "Break Neck Ridge",
		image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg",
		description: "Beautiful Majestic Scenery. No bathrooms."
	}
];

const seedDB = () => {
	// Remove all campgrounds
	Campground.remove({}, (err) => {
		if(err) console.log(err)
		else {
			console.log("All Campgrounds successfully removed!");
		};
		// add a few campgrounds
		data.forEach((campground) => {
			Campground.create(campground, (err, newCampground) => {
				if(err) console.log(err);
				else {
					console.log("new campground created!");
					// create a new comment
					Comment.create(
						{
							text: "This place is great, but I wish there was internet.",
							author: "Hommer"
						}, (err, comment) => {
								if(err) console.log(err)
								else {
									newCampground.comments.push(comment);
									newCampground.save();
									console.log("Created new comment!");
								}
						});
				};
			});
		});
	});




	// add a few comments
};

module.exports = seedDB;