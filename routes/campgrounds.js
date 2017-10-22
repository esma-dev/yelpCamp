const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const geocoder = require("geocoder");

//INDEX ROUTE
router.get('/', (req, res, next) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) console.log('ERROR!!!', err);
		else {
			res.render('campgrounds/index', {
				campgrounds: allCampgrounds,
				currUser: req.user,
				page: "campgrounds"
			});
		}
	});
});

//NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res, next) => {
	res.render("campgrounds/new");
});

//CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res, next) => {
	//get data from form and add to campgrounds array
	const campgroundName = req.body.name;
	const campgroundImg = req.body.image;
	const campgroundPrice = req.body.price;
	const campgroundDesc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};

	geocoder.geocode(req.body.location, (err, data) => {
		const lat = data.results[0].geometry.location.lat;
	    const lng = data.results[0].geometry.location.lng;
	    const location = data.results[0].formatted_address;
	    const newCampground = {
			name: campgroundName, 
			image: campgroundImg, 
			price: campgroundPrice,
			description: campgroundDesc,
			author: author,
			location: location,
			lat: lat,
			lng: lng
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res, next) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", { campground: foundCampground});		
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res, next) => {
	geocoder.geocode(req.body.location, function (err, data) {
		if (err) console.log("ERROR: ", err);
	    const lat = data.results[0].geometry.location.lat;
	    const lng = data.results[0].geometry.location.lng;
	    const location = data.results[0].formatted_address;
	    const newData = {
	    	name: req.body.name, 
	    	image: req.body.image,
	    	price: req.body.price, 
	    	description: req.body.description,  
	    	location: location, 
	    	lat: lat, 
	    	lng: lng};

	    //find campground and update
		Campground.findByIdAndUpdate(req.params.id, {$set: newData}, (err, updatedCampground) => {
			if (err) {
				req.flash("error", err.message);
				res.redirect("back");
			} else{
				req.flash("success", "Successfully Updated!");
				//redirect somewhere
				res.redirect("/campgrounds/" + req.params.id);
			};
		});	
	});	
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res, next) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) res.redirect("/campgrounds");
		else {
			req.flash("error", "Campground deleted.");
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;