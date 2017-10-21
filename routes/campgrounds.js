const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");


//middleware
const isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.render("login");
	}
};

//INDEX ROUTE
router.get('/', (req, res, next) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) console.log('ERROR!!!', err);
		else {
			res.render('campgrounds/index', {
				campgrounds: allCampgrounds,
				currUser: req.user
			});
		}
	});
});

//NEW ROUTE
router.get('/new', isLoggedIn, (req, res, next) => {
	res.render("campgrounds/new");
});

//CREATE ROUTE
router.post('/', isLoggedIn, (req, res, next) => {
	//get data from form and add to campgrounds array
	const campgroundName = req.body.name;
	const campgroundImg = req.body.image;
	const campgroundDesc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = {
		name: campgroundName, 
		image: campgroundImg, 
		description: campgroundDesc,
		author: author
	};
	//Create a new campground and save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err) console.log('ERROR!!!', err);
		else {
			//redirect to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//SHOW ROUTE
router.get('/:id', (req, res, next) => {
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) console.log('OH NO, ERROR FOUND: ', err);
		else {
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground})
		};
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", (req, res, next) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err) res.redirect("/campgrounds");
		else {
			res.render("campgrounds/edit", { campground: foundCampground});
		}
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", (req, res, next) => {
	//find campground and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) res.redirect("/campgrounds");
		else{
			//redirect somewhere
			res.redirect("/campgrounds/" + req.params.id);
		};
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", (req, res, next) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) res.redirect("/campgrounds");
		else {
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;