const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");


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
router.get('/new', (req, res, next) => {
	res.render("campgrounds/new");
});

//CREATE ROUTE
router.post('/', (req, res, next) => {
	//get data from form and add to campgrounds array
	const campgroundName = req.body.name;
	const campgroundImg = req.body.image;
	const campgroundDesc = req.body.description;
	const newCampground = {name: campgroundName, image: campgroundImg, description: campgroundDesc};
	Campground.create(newCampground, (err) => {
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
			// console.log(foundCampground);
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground})
		};
	});
});

module.exports = router;