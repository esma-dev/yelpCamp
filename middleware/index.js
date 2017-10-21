const Campground = require("../models/campground");
const Comment = require("../models/comment");

//all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.render("login");
	}
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err) res.redirect("back");
			else {
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					//if not logged in, redirect somewhere
					res.redirect("back");				}
			}
		});
	} else {
		//if not logged in, redirect somewhere
		res.redirect("back"); //takes the user back to the previuos page they came from
	}
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) res.redirect("back");
			else {
				// does user own comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

module.exports = middlewareObj;