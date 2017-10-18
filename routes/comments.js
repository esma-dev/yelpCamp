const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//middleware
const isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.render("login");
	}
};

//COMMENTS NEW
router.get("/new", isLoggedIn, (req, res, next) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) console.log(err)
		else {
			res.render("comments/new", { campground });
		}
	});
});

//COMMENTS CREATE
router.post("/", isLoggedIn, (req, res, next) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) console.log("something went wrong with the CREATE route")
		else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) console.log(err);
				else {
					//associate the comment to the campground
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		};
	});
});

module.exports = router;