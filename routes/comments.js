const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, (req, res, next) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) console.log(err)
		else {
			res.render("comments/new", { campground });
		}
	});
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, (req, res, next) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) console.log("something went wrong with the CREATE route")
		else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					req.flash("err", "Something went wrong.")
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//associate the comment to the campground
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		};
	});
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res, next) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) res.redirect("back");
		else {
			res.render("comments/edit", { 
				campground_id: req.params.id,
				comment: foundComment
			});
		}
	});
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res, next) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) res.redirect("back");
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res, next) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) res.redirect("back");
		else {
			req.flash("success", "Comment deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		};
	});
});

module.exports = router;