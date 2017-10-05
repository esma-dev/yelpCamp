const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//schema set up
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

//build a model from Schema
const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
// 	name: "Granite Hill", 
// 	image: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg",
// 	description: "This is a beautiful camp. It has accessible bathrooms. Bring your camera!"
// }, (err, campground) => {
// 	if(err) console.log('WE\'VE GOT AN ERROR: ', err);
// 	else console.log('NEW CAMPGROUND: ', campground);
// });


// let campgrounds = [
// 	{name: "Salmon Creek", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
// 	{name: "Granite Hill", img: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg"},
// 	{name: "Mountain Goat's Rest", img: "https://farm2.staticflickr.com/1438/1132929618_02124c4fc2.jpg"},
// 	{name: "Salmon Creek", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
// 	{name: "Granite Hill", img: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg"},
// 	{name: "Mountain Goat's Rest", img: "https://farm2.staticflickr.com/1438/1132929618_02124c4fc2.jpg"},
// 	{name: "Salmon Creek", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
// 	{name: "Granite Hill", img: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg"},
// 	{name: "Mountain Goat's Rest", img: "https://farm2.staticflickr.com/1438/1132929618_02124c4fc2.jpg"}
// ];

app.get('/', (req, res, next) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res, next) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) console.log('ERROR!!!', err);
		else {
			res.render('index', {campgrounds: allCampgrounds});
		}
	});
});

app.get('/campgrounds/new', (req, res, next) => {
	res.render("new");
});

app.get('/campgrounds/:id', (req, res, next) => {
	//find the campground with the provided ID
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) console.log('OH NO, ERROR FOUND: ', err);
		else {
			//render show template with that campground
			res.render('show', {campground: foundCampground})
		}
	});
});

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

app.listen(3000, () => {
	console.log('Yelp Camp Server is live!');
});