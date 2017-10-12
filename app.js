const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  Campground = require("./models/campground");
	  seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//ROOT ROUTE
app.get('/', (req, res, next) => {
	res.render('landing');
});

//INDEX ROUTE
app.get('/campgrounds', (req, res, next) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) console.log('ERROR!!!', err);
		else {
			res.render('index', {campgrounds: allCampgrounds});
		}
	});
});

//NEW ROUTE
app.get('/campgrounds/new', (req, res, next) => {
	res.render("new");
});

//CREATE ROUTE
app.post('/campgrounds', (req, res, next) => {
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
app.get('/campgrounds/:id', (req, res, next) => {
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) console.log('OH NO, ERROR FOUND: ', err);
		else {
			console.log(foundCampground);
			//render show template with that campground
			res.render('show', {campground: foundCampground})
		}
	});
});


app.listen(3000, () => {
	console.log('Yelp Camp Server is live!');
});