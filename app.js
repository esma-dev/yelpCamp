const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
	res.render('landing');
});

let campgrounds = [
	{name: "Salmon Creek", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
	{name: "Granite Hill", img: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg"},
	{name: "Mountain Goat's Rest", img: "https://farm3.staticflickr.com/2947/15215548990_efc53d32b6.jpg"}
];

app.get('/campgrounds', (req, res, next) => {
	res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res, next) => {
	//get data from form and add to campgrounds array
	const campgroundName = req.body.name;
	const campgroundImg = req.body.image;
	campgrounds.push(
		{ name: campgroundName,
		  img: campgroundImg });
	//redirect to campgrounds page
	res.redirect("/campgrounds");
});

app.get('/campgrounds/new', (req, res, next) => {
	res.render("new");
});

app.listen(3000, () => {
	console.log('Yelp Camp Server is live!');
});