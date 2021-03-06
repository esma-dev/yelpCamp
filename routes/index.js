const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//ROOT ROUTE
router.get('/', (req, res, next) => {
	res.render('landing');
});

//SIGN UP FORM- show register form
router.get("/register", (req, res, next) => {
	res.render("register", {page: "register"});	
});

//SIGN UP - handling sign up logic
router.post("/register", (req, res, next) => {
	const newUser = new User({username: req.body.username});
	// eval(require('locus')); //freezes the code
	if(req.body.adminCode === "T!ger098"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			// req.flash("error", err.message + ".");
			return res.render("register", {error: err.message + "."});
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp, " + user.username);
			res.redirect("/campgrounds");
		}); 
	});
});


//LOGIN FORM - show login form
router.get("/login", (req, res, next) => {
	res.render("login", {page: "login"});
});

//LOGIN - handling log in logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}),(req, res, next) => {
});

//LOG OUT
router.get("/logout", (req, res, next) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;